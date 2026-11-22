"""kitfonts — chọn font chạy được cả Windows lẫn Linux (phiên cloud).

kf("C:/Windows/Fonts/arialbd.ttf") trả lại đúng đường dẫn đó nếu file có thật (Windows),
nếu không thì trả font thay thế trên Linux. Bảng thay thế:
  arial / arialbd      -> Liberation Sans (cùng số đo chữ với Arial)
  ariblk (Arial Black) -> Archivo Black (OFL)   — gần nhất, KHÔNG giống hệt
  impact               -> Anton (OFL)           — gần nhất, KHÔNG giống hệt
  seguisym             -> Noto Sans Symbols2
  seguiemj             -> Noto Color Emoji (chỉ nạp được ở cỡ 109)
  Roboto-BlackItalic   -> bản Roboto của gói fonts-roboto
"""
import os

_LIN = {
    "arial.ttf": "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "arialbd.ttf": "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "ariblk.ttf": "/usr/local/share/fonts/tylerkit/ArchivoBlack-Regular.ttf",
    "impact.ttf": "/usr/local/share/fonts/tylerkit/Anton-Regular.ttf",
    "seguisym.ttf": "/usr/share/fonts/truetype/noto/NotoSansSymbols2-Regular.ttf",
    "seguiemj.ttf": "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf",
    "roboto-blackitalic.ttf": "/usr/share/fonts/truetype/roboto/unhinted/RobotoTTF/Roboto-BlackItalic.ttf",
}


def kf(path):
    if path and os.path.exists(path):
        return path
    alt = _LIN.get(os.path.basename(path or "").lower())
    return alt if alt and os.path.exists(alt) else path
