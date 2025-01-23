import scapy.all as scapy
import socket
import subprocess
import platform
import os
import requests

def scan_network(ip_range, iface):
    """
    扫描指定网络接口的局域网设备
    """
    print(f"Scanning on interface: {iface}")

    # 发送ARP请求并获取响应
    arp_request = scapy.ARP(pdst=ip_range)
    broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
    arp_request_broadcast = broadcast / arp_request
    answered_list = scapy.srp(arp_request_broadcast, timeout=1, iface=iface, verbose=False)[0]

    devices = []
    for element in answered_list:
        ip = element[1].psrc
        mac = element[1].hwsrc
        hostname = get_hostname(ip)
        os_type = get_os_type(ip, mac)
        device_info = {
            "ip": ip,
            "mac": mac,
            "hostname": hostname,
            "os_type": os_type
        }
        devices.append(device_info)
    return devices

def get_hostname(ip):
    """
    获取设备的 hostname
    """
    try:
        hostname = socket.gethostbyaddr(ip)[0]
    except socket.herror:
        hostname = "Unknown"
    return hostname

def get_os_type(ip, mac):
    """
    通过 TTL 值和 MAC 地址前缀判断设备操作系统类型
    """
    # 通过 TTL 值初步判断
    param = "-n" if platform.system().lower() == "windows" else "-c"
    command = ["ping", param, "1", ip]
    try:
        output = subprocess.check_output(command, stderr=subprocess.STDOUT, universal_newlines=True)
        if "ttl=" in output.lower():
            ttl = int(output.lower().split("ttl=")[1].split()[0])
            if ttl <= 64:
                # 可能是 Linux/Unix 或 Android 或 HarmonyOS
                return detect_mobile_os(mac)
            elif ttl <= 128:
                return "Windows"
            else:
                return "Unknown"
    except subprocess.CalledProcessError:
        pass
    return "Unknown"

def detect_mobile_os(mac):
    """
    通过 MAC 地址前缀判断手机操作系统类型
    """
    # MAC 地址前缀（OUI）对应的制造商
    oui = mac[:8].upper().replace(":", "")
    if oui in ["A4C3F0", "001D0F", "001D0E"]:  # 华为设备的 OUI
        return "HarmonyOS"
    elif oui in ["001D0F", "001D0E", "001D0D"]:  # 苹果设备的 OUI
        return "iOS"
    elif oui in ["001D0F", "001D0E", "001D0D"]:  # 其他 Android 设备的 OUI
        return "Android"
    else:
        return "Linux/Unix"  # 默认返回 Linux/Unix

def display_all_devices(devices_dict):
    """
    集中显示所有接口下的设备信息
    """
    print("\n扫描结果:")
    for iface, devices in devices_dict.items():
        print(f"\n设备列表: {iface}")
        print("IP地址\t\t\tMAC地址\t\t\t\t主机名称\t\t操作系统类型")
        print("------------------------------------------------------------")
        for device in devices:
            print(f"{device['ip']}\t\t{device['mac']}\t\t{device['hostname']}\t\t{device['os_type']}")

def get_all_interfaces():
    """
    获取所有可用的网络接口
    """
    return scapy.get_if_list()

if __name__ == "__main__":
    ip_range = "192.168.1.1/24"  # 修改为你的局域网IP范围

    # 获取所有网络接口
    interfaces = get_all_interfaces()
    print("Available network interfaces:", interfaces)

    # 存储所有接口的设备信息
    all_devices = {}

    # 遍历每个网络接口并扫描设备
    for iface in interfaces:
        try:
            devices = scan_network(ip_range, iface)
            if devices:
                all_devices[iface] = devices
            else:
                print(f"No devices found on interface: {iface}")
        except Exception as e:
            print(f"Error scanning on interface {iface}: {e}")

    # 集中显示所有接口的设备信息
    display_all_devices(all_devices)

    # 等待用户按任意键退出
    os.system('pause')