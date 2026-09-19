import requests

AGMARKNET_URL = (
    "https://api.agmarknet.gov.in/v1/"
    "prices-and-arrivals/market-price/lastweek"
)

TOMATO_ID = 65
KARNATAKA_ID = 16
BENGALURU_MARKET_ID = 100

params = {
    "marketId": BENGALURU_MARKET_ID,
    "stateId": KARNATAKA_ID,
    "commodityId": TOMATO_ID
}

headers = {
    "Accept": "application/json, text/plain, */*",
    "Origin": "https://agmarknet.gov.in",
    "Referer": "https://agmarknet.gov.in/",
    "User-Agent": "Mozilla/5.0"
}

print("Fetching AGMARKNET data...")
print()

try:

    response = requests.get(
        AGMARKNET_URL,
        params=params,
        headers=headers,
        timeout=30
    )

    print("HTTP Status:", response.status_code)

    response.raise_for_status()

    data = response.json()

    print("API Success:", data.get("success"))
    print()

    records = data.get("data", [])

    if not records:
        print("No market data returned.")
    else:

        record = records[0]

        print("Tomato prices returned by AGMARKNET:")
        print("--------------------------------------")

        dates = sorted(
            [
                key
                for key in record.keys()
                if len(key) == 10
                and key[4] == "-"
                and key[7] == "-"
            ],
            reverse=True
        )

        for date in dates:

            value = record.get(date)

            if value == "NR":
                print(date, "→ NR")
                continue

            try:

                price_per_quintal = float(value)

                price_per_kg = (
                    price_per_quintal / 100
                )

                print(
                    f"{date} → "
                    f"₹{price_per_quintal}/quintal "
                    f"→ ₹{price_per_kg:.2f}/kg"
                )

            except Exception:

                print(
                    date,
                    "→",
                    value
                )

except Exception as e:

    print("ERROR:", e)