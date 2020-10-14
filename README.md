# SMS-SERVICE

#### Clone the repository

```bash
git clone https://github.com/communcom/sms-service.git
cd sms-service
```

Add variables
```bash
TWILIO_ACCOUNT_SID=sid
TWILIO_AUTH_TOKEN=auth-token
GLS_TWILIO_PHONE_FROM=phone
```

#### Create docker-compose file

```bash
cp docker-compose.example.yml docker-compose.yml 
```

#### Run

```bash
docker-compose up -d --build
```