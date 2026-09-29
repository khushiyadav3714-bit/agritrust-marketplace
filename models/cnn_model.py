import os

def build_model():
    """Builds EfficientNetB0 transfer learning model architecture for tomato classification."""
    try:
        import tensorflow as tf
        from tensorflow.keras.applications import EfficientNetB0
        from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
        from tensorflow.keras.models import Model

        base_model = EfficientNetB0(
            weights="imagenet",
            include_top=False,
            input_shape=(224, 224, 3)
        )
        base_model.trainable = False

        x = base_model.output
        x = GlobalAveragePooling2D()(x)
        x = Dropout(0.3)(x)
        predictions = Dense(2, activation="softmax")(x)

        model = Model(inputs=base_model.input, outputs=predictions)
        model.compile(
            optimizer="adam",
            loss="categorical_crossentropy",
            metrics=["accuracy"]
        )
        return model
    except Exception as e:
        print(f"TensorFlow CNN model builder error: {e}")
        return None
