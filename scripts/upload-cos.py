# scripts/upload-cos.py
"""上传 out/ 目录到腾讯云 COS，自动设置正确的 Content-Type
用法: python scripts/upload-cos.py
前提: 已执行过 coscmd config 配置密钥
"""
import os, configparser
from qcloud_cos import CosConfig, CosS3Client

# 读取 coscmd 配置
cfg = configparser.ConfigParser()
cfg.read(os.path.expanduser("~/.cos.conf"))
secret_id = cfg["common"]["secret_id"]
secret_key = cfg["common"]["secret_key"]
bucket = cfg["common"]["bucket"]

config = CosConfig(Region="ap-beijing", SecretId=secret_id, SecretKey=secret_key)
client = CosS3Client(config)

# MIME 映射
MIME_MAP = {
    ".html": "text/html; charset=utf-8",
    ".htm": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".webmanifest": "application/manifest+json",
}

def get_content_type(filename):
    ext = os.path.splitext(filename)[1].lower()
    return MIME_MAP.get(ext, "application/octet-stream")

out_dir = os.path.join(os.path.dirname(__file__), "..", "out")
count = 0

for root, dirs, files in os.walk(out_dir):
    for f in files:
        local_path = os.path.join(root, f)
        key = os.path.relpath(local_path, out_dir).replace("\\", "/")
        content_type = get_content_type(f)

        client.put_object_from_local_file(
            Bucket=bucket,
            LocalFilePath=local_path,
            Key=key,
            ContentType=content_type,
        )
        count += 1
        if count % 100 == 0:
            print(f"  已上传 {count} 个文件...")

print(f"完成！共 {count} 个文件")
