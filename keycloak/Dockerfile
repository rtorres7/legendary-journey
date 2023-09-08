FROM quay.io/keycloak/keycloak:21.1

COPY myrealm.json /opt/keycloak/data/import/myrealm.json

ENTRYPOINT [ "/opt/keycloak/bin/kc.sh", "start-dev", "--import-realm", "--proxy=passthrough", "--db=postgres"]
