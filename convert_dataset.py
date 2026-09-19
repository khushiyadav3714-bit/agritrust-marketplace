import os
import shutil

# Original downloaded dataset
SOURCE_DIR = os.path.join(
    os.path.dirname(__file__),
    "dataset",
    "Tomato_Dataset.v5"
)

# New classification dataset
OUTPUT_DIR = os.path.join(
    os.path.dirname(__file__),
    "classification_dataset"
)

IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")


def copy_images(source_split, output_split):

    source_images = os.path.join(
        SOURCE_DIR,
        source_split,
        "images"
    )

    output_path = os.path.join(
        OUTPUT_DIR,
        output_split
    )

    fresh_dir = os.path.join(output_path, "fresh")
    rotten_dir = os.path.join(output_path, "rotten")

    os.makedirs(fresh_dir, exist_ok=True)
    os.makedirs(rotten_dir, exist_ok=True)

    fresh_count = 0
    rotten_count = 0
    unknown_count = 0

    for filename in os.listdir(source_images):

        if not filename.lower().endswith(IMAGE_EXTENSIONS):
            continue

        source_file = os.path.join(source_images, filename)

        name = filename.lower()

        if name.startswith("fresh"):
            destination = os.path.join(fresh_dir, filename)
            shutil.copy2(source_file, destination)
            fresh_count += 1

        elif name.startswith("rotten"):
            destination = os.path.join(rotten_dir, filename)
            shutil.copy2(source_file, destination)
            rotten_count += 1

        else:
            unknown_count += 1
            print("WARNING - Unknown image:", filename)

    print("\n" + source_split.upper())
    print("Fresh   :", fresh_count)
    print("Rotten  :", rotten_count)
    print("Unknown :", unknown_count)
    print("Total   :", fresh_count + rotten_count)


print("========================================")
print(" TOMATO DATASET CONVERSION")
print("========================================")

# Delete old classification dataset completely
if os.path.exists(OUTPUT_DIR):
    print("\nRemoving old classification dataset...")
    shutil.rmtree(OUTPUT_DIR)

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Convert train
copy_images("train", "train")

# Convert validation
copy_images("valid", "validation")

# Convert test
copy_images("test", "test")

print("\n========================================")
print(" CONVERSION COMPLETED!")
print("========================================")

print("\nNew dataset created at:")
print(OUTPUT_DIR)