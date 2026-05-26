# scripts/deploy-cos.ps1
# 部署 out/ 到腾讯云 COS 静态网站
# 前提：已安装 coscli (https://github.com/tencentyun/coscli)

param(
  [string]$Bucket = "",
  [string]$Region = "ap-guangzhou"
)

if (-not $Bucket) {
  Write-Host "用法: .\scripts\deploy-cos.ps1 -Bucket 你的桶名-APPID -Region ap-guangzhou"
  exit 1
}

Write-Host "构建中..."
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "上传到 cos://$Bucket ..."
coscli sync out/ "cos://$Bucket/" --delete --include "*.html" --content-type "text/html; charset=utf-8"
coscli sync out/ "cos://$Bucket/" --delete --exclude ".*"

Write-Host "部署完成！"
Write-Host "访问地址：https://$Bucket.cos.$Region.myqcloud.com/index.html"
