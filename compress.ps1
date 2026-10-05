Add-Type -AssemblyName System.Drawing
$imgPath = "d:\Madanil\portfolio\image.png"
$outPath = "d:\Madanil\portfolio\image.jpg"

if (Test-Path $imgPath) {
    $img = [System.Drawing.Image]::FromFile($imgPath)
    $newWidth = 400
    $newHeight = [math]::Floor($img.Height * ($newWidth / $img.Width))
    $bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $newWidth, $newHeight)
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]70)
    
    # Needs a hack for the .NET garbage collector locking the file sometimes
    $bmp.Save($outPath, $codec, $encoderParams)
    $g.Dispose()
    $bmp.Dispose()
    $img.Dispose()
    Write-Output "Image compressed successfully."
} else {
    Write-Output "Image not found."
}
