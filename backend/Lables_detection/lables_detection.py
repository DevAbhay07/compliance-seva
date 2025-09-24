from ultralytics import YOLO
import cv2
import cvzone
import math
import os

# Load YOLO11s model with your trained weights
model = YOLO("last_8.pt")   # or use "runs/detect/train/weights/best.pt" if you want your fine-tuned weights

# Load image
img = cv2.imread(r"test_images/IMG-20250924-WA0076.jpg")  # replace with your image path

# Create folder for cropped images
output_folder = "cropped_detections"
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

results = model(img)

detection_count = 0
for r in results:
    boxes = r.boxes
    for box in boxes:
        # Bounding Box
        x1, y1, x2, y2 = box.xyxy[0]
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        w, h = x2 - x1, y2 - y1
        cvzone.cornerRect(img, (x1, y1, w, h))

        # Confidence
        conf = math.ceil((box.conf[0] * 100)) / 100

        # Class Name
        cls = int(box.cls[0])
        classNames = ['Details', 'barcode', 'bestBeforeDate', 'brand', 'detailedProductName', 
        'energyPerNutrientBasis', 'ingredientStatement', 'instructions', 'logoLabel', 
        'nutriScore', 'nutritionTable', 'productName', 'qrCode', 'variantDescription', 
        'weightOrVolume', 'date', 'MRP_expiry', 'cheese_balls_crax', 'crax', 'curlz', 
        'expiry', 'frills', 'la', 'label_box', 'mfg_date', 'natkhat', 'price', 'tedhe_medhe']
        
        # Check if class index is within bounds
        if cls < len(classNames):
            class_name = classNames[cls]
        else:
            class_name = f"Unknown_Class_{cls}"
        
        cvzone.putTextRect(img, f'{class_name} {conf}',
                           (max(0, x1), max(35, y1)), scale=1, thickness=1)
        
        # Crop and save the detected section
        cropped_img = img[y1:y2, x1:x2]
        if cropped_img.size > 0:  # Check if crop is valid
            detection_count += 1
            filename = f"{class_name}_{detection_count}_conf{conf}.jpg"
            filepath = os.path.join(output_folder, filename)
            cv2.imwrite(filepath, cropped_img)
            print(f"Saved cropped image: {filepath}")

# Save the result
cv2.imwrite("result_yolo11s6.jpg", img)

print("Detection complete. Saved as result_yolo11s.jpg")
print(f"Cropped {detection_count} detected sections to '{output_folder}' folder")
