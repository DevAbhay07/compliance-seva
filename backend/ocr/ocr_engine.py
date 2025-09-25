import cv2
from .preprocess import preprocess_image
import numpy as np
import easyocr
from paddleocr import PaddleOCR

# Initialize OCR engines
paddle_ocr = PaddleOCR(use_angle_cls=False, lang="en")
easy_ocr = easyocr.Reader(['en'])

def run_paddleocr(filepath):
    img = preprocess_image(filepath)
    result = paddle_ocr.ocr(img)
    valid_results = []
    if isinstance(result, list) and len(result) > 0:
        items = result[0] if isinstance(result[0], list) else result
        for item in items:
            try:
                box, (text, conf) = item
                points = np.array([[int(float(x)), int(float(y))] for x, y in box], dtype=np.int32)
                valid_results.append((points, text, conf))
            except Exception:
                continue
    return valid_results

def run_easyocr(filepath):
    img = preprocess_image(filepath)
    reader_result = easy_ocr.readtext(img)
    valid_results = []
    for bbox, text, conf in reader_result:
        try:
            points = np.array([[int(pt[0]), int(pt[1])] for pt in bbox], dtype=np.int32)
            valid_results.append((points, text, conf))
        except:
            continue
    return valid_results
