import cv2
import numpy as np

def preprocess_image(filepath):
    # Read image
    img = cv2.imread(filepath)
    if img is None:
        raise ValueError("Image not found or cannot be read.")
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Contrast stretching (normalize to full 0-255)
    norm_img = cv2.normalize(gray, None, 0, 255, cv2.NORM_MINMAX)

    # Sharpening
    kernel_sharp = np.array([[0, -1, 0], [-1, 5,-1], [0, -1, 0]])
    sharp = cv2.filter2D(norm_img, -1, kernel_sharp)

    # Denoise
    denoised = cv2.fastNlMeansDenoising(sharp, h=20)

    # Deskew (auto-rotate to correct skew)
    coords = np.column_stack(np.where(denoised > 0))
    angle = 0
    if coords.shape[0] > 0:
        rect = cv2.minAreaRect(coords)
        angle = rect[-1]
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle
        (h, w) = denoised.shape[:2]
        M = cv2.getRotationMatrix2D((w // 2, h // 2), angle, 1.0)
        denoised = cv2.warpAffine(denoised, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

    # Adaptive thresholding
    thresh = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 15
    )
    # Morphological operations to remove noise and close gaps
    kernel = np.ones((2,2), np.uint8)
    morph = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=1)
    # Optionally, resize for better OCR
    scale = 2.0
    morph = cv2.resize(morph, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
    return morph
