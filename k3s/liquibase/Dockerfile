FROM liquibase/liquibase:4.23

ENV LIQUIBASE_SECURE_PARSING=false
COPY migrations/ /liquibase/changelog/

CMD ["--url=jdbc:postgresql://postgres:5432/maximus", "--changelog-file=changelog-root.xml", "--username=maximus", "--password=magic", "update"]
