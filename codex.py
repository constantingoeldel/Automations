import requests
import json

# Get the current ethereum price
eth_price = requests.get('https://api.coinbase.com/v2/prices/ETH-USD/spot')

# Save the price in a variable
eth_price_data = eth_price.json()

# Turn the data into a human-readable string
eth_price_string = "The current price of Ethereum is: $" + eth_price_data['data']['amount']

# Save the string to a pastebin
pastebin_url = requests.post('https://pastebin.com/api/api_post.php', data={
    'api_dev_key': '6M9KiRZRUjofwDUo2BIlVUAkrWYbdpud',
    'api_option': 'paste',
    'api_paste_code': eth_price_string,
    'api_paste_private': '0',
    'api_paste_expire_date': 'N'
})

print(pastebin_url.text)