import os

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import (
    EarlyStopping,
    ModelCheckpoint,
    ReduceLROnPlateau
)

from models.cnn_model import build_model


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

TRAIN_DIR = os.path.join(
    BASE_DIR,
    "classification_dataset",
    "train"
)

VAL_DIR = os.path.join(
    BASE_DIR,
    "classification_dataset",
    "validation"
)


# ============================================================
# CHECK DATASET
# ============================================================

if not os.path.exists(TRAIN_DIR):
    raise FileNotFoundError(
        f"Training dataset not found:\n{TRAIN_DIR}"
    )

if not os.path.exists(VAL_DIR):
    raise FileNotFoundError(
        f"Validation dataset not found:\n{VAL_DIR}"
    )


print("========================================")
print(" TOMATO FRESH / ROTTEN TRAINING")
print(" EfficientNetB0")
print("========================================")


print("\nTraining directory:")
print(TRAIN_DIR)

print("\nValidation directory:")
print(VAL_DIR)


# ============================================================
# DATA AUGMENTATION
# ============================================================

train_datagen = ImageDataGenerator(
    rotation_range=25,
    width_shift_range=0.15,
    height_shift_range=0.15,
    zoom_range=0.20,
    shear_range=0.10,
    horizontal_flip=True
)


val_datagen = ImageDataGenerator()


# ============================================================
# TRAIN GENERATOR
# ============================================================

train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=(224, 224),
    batch_size=32,
    class_mode="categorical",
    shuffle=True
)


# ============================================================
# VALIDATION GENERATOR
# ============================================================

val_generator = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=(224, 224),
    batch_size=32,
    class_mode="categorical",
    shuffle=False
)


# ============================================================
# DATASET INFORMATION
# ============================================================

print("\n========================================")
print(" DATASET INFORMATION")
print("========================================")

print(
    "Training images   :",
    train_generator.samples
)

print(
    "Validation images :",
    val_generator.samples
)

print(
    "Class labels      :",
    train_generator.class_indices
)


# ============================================================
# BUILD NEW MODEL
# ============================================================

print("\n========================================")
print(" BUILDING EfficientNetB0")
print("========================================")

model = build_model()

model.summary()


# ============================================================
# MODEL DIRECTORY
# ============================================================

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)

os.makedirs(
    MODEL_DIR,
    exist_ok=True
)


# ============================================================
# CALLBACKS
# ============================================================

checkpoint = ModelCheckpoint(
    os.path.join(
        MODEL_DIR,
        "tomato_model.keras"
    ),
    monitor="val_accuracy",
    mode="max",
    save_best_only=True,
    verbose=1
)


early_stopping = EarlyStopping(
    monitor="val_accuracy",
    mode="max",
    patience=6,
    restore_best_weights=True,
    verbose=1
)


reduce_lr = ReduceLROnPlateau(
    monitor="val_loss",
    factor=0.3,
    patience=2,
    min_lr=1e-7,
    verbose=1
)


# ============================================================
# CLASS WEIGHTS
# ============================================================

class_weights = {
    0: 1.0,
    1: 1.5
}


# ============================================================
# TRAIN
# ============================================================

print("\n========================================")
print(" STARTING TRAINING")
print("========================================")

history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=20,
    callbacks=[
        checkpoint,
        early_stopping,
        reduce_lr
    ],
    class_weight=class_weights
)


# ============================================================
# SAVE FINAL MODEL
# ============================================================

final_model_path = os.path.join(
    MODEL_DIR,
    "tomato_model_final.keras"
)

model.save(final_model_path)


# ============================================================
# COMPLETED
# ============================================================

print("\n========================================")
print(" TRAINING COMPLETED!")
print("========================================")

print("\nBest model:")
print(
    os.path.join(
        MODEL_DIR,
        "tomato_model.keras"
    )
)

print("\nFinal model:")
print(final_model_path)

print("\nClass labels:")
print(train_generator.class_indices)

print("\n========================================")
print(" DONE")
print("========================================")