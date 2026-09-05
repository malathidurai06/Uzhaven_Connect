"""
Trains the AI Demand Prediction model.

Model: Gradient Boosting Regressor (scikit-learn) over engineered date features.
This is a lightweight, easily explainable alternative to a full LSTM/Prophet
setup, which is ideal for a final-year viva where you need to clearly explain
every feature going into the model.

Input features: crop_name (encoded), region (encoded), month, day_of_week
Target: demand_kg

Output: models/demand_model.joblib
"""
import pandas as pd
# pyrefly: ignore [missing-import]
import joblib
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

df = pd.read_csv("data/sample_demand.csv")
df["date"] = pd.to_datetime(df["date"])
df["month"] = df["date"].dt.month
df["day_of_week"] = df["date"].dt.dayofweek

crop_encoder = LabelEncoder()
region_encoder = LabelEncoder()
df["crop_encoded"] = crop_encoder.fit_transform(df["crop_name"])
df["region_encoded"] = region_encoder.fit_transform(df["region"])

X = df[["crop_encoded", "region_encoded", "month", "day_of_week"]]
y = df["demand_kg"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = GradientBoostingRegressor(n_estimators=200, max_depth=4, random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
mae = mean_absolute_error(y_test, preds)
r2 = r2_score(y_test, preds)
print(f"Demand model trained. MAE: {mae:.2f} kg | R2: {r2:.3f}")

joblib.dump(
    {"model": model, "crop_encoder": crop_encoder, "region_encoder": region_encoder},
    "models/demand_model.joblib"
)
print("Saved models/demand_model.joblib")
