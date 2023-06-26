name=$2
environment=$3

echo "$name"
echo "$environment"

generate_post_data()
{
  cat <<EOF
{
    "msg_type": "interactive",
    "card": {
        "config": {
            "wide_screen_mode": true
        },
        "elements": [
            {
                "tag": "div",
                "text": {
                    "content": "Dear **IoT Team**,\n\nThis is just a reminder that **your deployment is success**.",
                    "tag": "lark_md"
                }
            },
            {
                "fields": [
                    {
                        "is_short": true,
                        "text": {
                            "content": "** SOURCE **\n api-iot",
                            "tag": "lark_md"
                        }
                    },
                    {
                        "is_short": true,
                        "text": {
                            "content": "** DATE **\n $(date '+%d/%m/%Y %X')",
                            "tag": "lark_md"
                        }
                    },
                    {
                        "is_short": false,
                        "text": {
                            "content": "",
                            "tag": "lark_md"
                        }
                    },
                     {
                        "is_short": true,
                        "text": {
                            "content": "** USER **\n $name",
                            "tag": "lark_md"
                        }
                    },
                     {
                        "is_short": true,
                        "text": {
                            "content": "** ENVIRONMENT **\n $environment" ,
                            "tag": "lark_md"
                        }
                    },
                    {
                        "is_short": false,
                        "text": {
                            "content": "",
                            "tag": "lark_md"
                        }
                    }
                ],
                "tag": "div"
            }
        ],
        "header": {
            "template": "green",
            "title": {
                "content": "DEPLOY SUCCESS",
                "tag": "plain_text"
            }
        }
    }
}

EOF
}


curl -H "Content-Type: application/json" -X POST -d "$(generate_post_data)" $1