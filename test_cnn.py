import os

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet import preprocess_input


# -----------------------------
# Paths
# -----------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# New classification test dataset
TEST_DIR = os.path.join(
    BASE_DIR,
    "classification_dataset",
    "test"
)

# New EfficientNetB0 model
MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "tomato_model.keras"
)


# -----------------------------
# Load trained model
# -----------------------------

print("Loading trained EfficientNetB0 model...")

model = load_model(MODEL_PATH)

print("Model loaded successfully!")


# -----------------------------
# Test data
# -----------------------------

test_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input
)

test_generator = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=(224, 224),
    batch_size=32,
    class_mode="categorical",
    shuffle=False
)


# -----------------------------
# Display information
# -----------------------------

print()
print("Test images:", test_generator.samples)
print("Class labels:", test_generator.class_indices)


# -----------------------------
# Evaluate
# -----------------------------

print()
print("Evaluating model...")

loss, accuracy = model.evaluate(
    test_generator,
    verbose=1
)


# -----------------------------
# Results
# -----------------------------

print()
print("========================================")
print(" TEST RESULTS")
print("========================================")

print("Test Loss    :", loss)
print("Test Accuracy:", accuracy)
print("Class Labels :", test_generator.class_indices)

print("========================================")