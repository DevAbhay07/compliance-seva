import os
import shutil

# List of datasets and their global class mapping
datasets = {
    "Batch-Details.v1i.yolov8": {0: 0},  # 1 class
    "ComputerVision.v11i.yolov8": {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8,
                                   8: 9, 9: 10, 10: 11, 11: 12, 12: 13, 13: 14},  # 14 classes
    "Experi Date.v1i.yolov8": {0: 15},  # 1 class
    "mrp label.v1i.yolov8": {0: 16, 1: 17, 2: 18, 3: 19, 4: 20, 5: 21, 6: 22,
                              7: 23, 8: 24, 9: 25, 10: 26, 11: 27, 12: 28}  # 13 classes
}

# Configure which splits to process (modify this list as needed)
splits_to_process = ["train", "valid", "test"]  # Change to ["train", "valid"] to skip test, etc.

# Define merged dataset path
merged_root = "merged_dataset"

# Create merged directories for each split
for split in splits_to_process:
    split_images = os.path.join(merged_root, split, "images")
    split_labels = os.path.join(merged_root, split, "labels")
    os.makedirs(split_images, exist_ok=True)
    os.makedirs(split_labels, exist_ok=True)

def remap_and_copy(dataset, class_map, split):
    """Remap labels and copy images/labels into merged_dataset"""
    dataset_root = os.path.join(dataset, split)
    image_dir = os.path.join(dataset_root, "images")
    label_dir = os.path.join(dataset_root, "labels")

    # Check if the split directory exists
    if not os.path.exists(dataset_root):
        print(f"⚠️  Split directory does not exist, skipping: {dataset_root}")
        return

    if not os.path.exists(label_dir):
        print(f"⚠️  Label directory does not exist, skipping: {label_dir}")
        return

    if not os.path.exists(image_dir):
        print(f"⚠️  Image directory does not exist, skipping: {image_dir}")
        return

    # Define target directories for this split
    merged_split_images = os.path.join(merged_root, split, "images")
    merged_split_labels = os.path.join(merged_root, split, "labels")

    for file in os.listdir(label_dir):
        if file.endswith(".txt"):
            label_path = os.path.join(label_dir, file)
            # Read and remap label file
            with open(label_path, "r") as f:
                lines = f.readlines()

            new_lines = []
            for line in lines:
                parts = line.strip().split()
                if not parts:
                    continue
                cls_id = int(parts[0])
                if cls_id in class_map:
                    parts[0] = str(class_map[cls_id])
                    new_lines.append(" ".join(parts) + "\n")
                else:
                    print(f"⚠️  Class ID {cls_id} in {label_path} not in class_map for {dataset}")

            # Save updated label with dataset prefix in the appropriate split folder
            new_label_path = os.path.join(merged_split_labels, f"{dataset.replace(' ', '_')}_{file}")
            if new_lines:
                with open(new_label_path, "w") as f:
                    f.writelines(new_lines)
                print(f"✅ Wrote label: {new_label_path} ({len(new_lines)} lines)")
            else:
                print(f"⚠️  No valid lines in label file after remapping: {label_path}")

            # Copy image with same name (jpg or png)
            image_file_jpg = file.replace(".txt", ".jpg")
            image_file_png = file.replace(".txt", ".png")
            src_img = None
            for img_file in [image_file_jpg, image_file_png]:
                potential_path = os.path.join(image_dir, img_file)
                if os.path.exists(potential_path):
                    src_img = potential_path
                    break

            if src_img:
                dst_img = os.path.join(merged_split_images, f"{dataset.replace(' ', '_')}_{os.path.basename(src_img)}")
                shutil.copy(src_img, dst_img)
                print(f"✅ Copied image: {src_img} -> {dst_img}")
            else:
                print(f"⚠️  Image file not found for label: {file} in {image_dir}")

# Process all datasets and specified splits only
print(f"🚀 Processing splits: {splits_to_process}")
for dataset, class_map in datasets.items():
    print(f"\n📂 Processing dataset: {dataset}")
    for split in splits_to_process:
        print(f"  Processing split: {split}")
        remap_and_copy(dataset, class_map, split)

print("✅ All datasets merged and remapped successfully!")
print(f"📁 Merged dataset structure:")
for split in splits_to_process:
    split_path = os.path.join(merged_root, split)
    if os.path.exists(split_path):
        images_count = len([f for f in os.listdir(os.path.join(split_path, "images")) if f.lower().endswith(('.jpg', '.png'))])
        labels_count = len([f for f in os.listdir(os.path.join(split_path, "labels")) if f.endswith('.txt')])
        print(f"  {split}: {images_count} images, {labels_count} labels")
