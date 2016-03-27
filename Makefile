REPORTER = list
MOCHA_OPTS = --ui bdd -c

seed:
	echo Seeding blog-test *******************************

	./db/seed.sh
test:
	clear

	echo Starting test *********************************
	./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	tests/*.js
	echo Ending test
start:
	node app
