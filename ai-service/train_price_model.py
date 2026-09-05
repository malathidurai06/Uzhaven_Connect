"""
Trains the AI Smart Price Recommendation model.

Model: RandomForestRegressor (scikit-learn)
Input features: crop_name (encoded), region (encoded), month, demand_index
Target: price_per_kg

Output: models/price_model.joblib (+ encoders) used by main.py at inference time.
"""
import pandas as pd
# pyrefly: ignore [missing-import]
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

df = pd.read_csv("data/sample_prices.csv")

crop_encoder = LabelEncoder()
region_encoder = LabelEncoder()
df["crop_encoded"] = crop_encoder.fit_transform(df["crop_name"])
df["region_encoded"] = region_encoder.fit_transform(df["region"])

X = df[["crop_encoded", "region_encoded", "month", "demand_index"]]
y = df["price_per_kg"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=200, max_depth=10, random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
mae = mean_absolute_error(y_test, preds)
r2 = r2_score(y_test, preds)
print(f"Price model trained. MAE: {mae:.2f} | R2: {r2:.3f}")

joblib.dump(
    {"model": model, "crop_encoder": crop_encoder, "region_encoder": region_encoder},
    "models/price_model.joblib"
)
print("Saved models/price_model.joblib")
