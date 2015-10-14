import { default as cli_, _terminalWidth } from 'cli';


var cli;

describe('Basic CLI tests', function() {

  beforeEach(() => {
    // Override yargs fail func so we can introspect the right errors
    // are happening when we hand it bogus input.
    this.fakeFail = sinon.stub();
    cli = cli_.exitProcess(false).fail(this.fakeFail);
  });

  it('should default Add-on type to "any"', () => {
    var args = cli.parse(['foo/bar.xpi']);
    assert.equal(args.type, 'any');
    assert.equal(args.t, 'any');
  });

  it('should default add-on output to "text"', () => {
    var args = cli.parse(['foo/bar.xpi']);
    assert.equal(args.output, 'text');
    assert.equal(args.o, 'text');
  });

  it('should default stack to false', () => {
    var args = cli.parse(['foo/bar.xpi']);
    assert.equal(args.stack, false);
  });

  it('should default pretty to false', () => {
    var args = cli.parse(['foo/bar.xpi']);
    assert.equal(args.pretty, false);
  });

  it('should default selfhosted to false', () => {
    var args = cli.parse(['foo/bar.xpi']);
    assert.equal(args.selfhosted, false);
  });

  it('should default determined to false', () => {
    var args = cli.parse(['foo/bar.xpi']);
    assert.equal(args.determined, false);
  });

  it('should default boring to false', () => {
    var args = cli.parse(['foo/bar.xpi']);
    assert.equal(args.boring, false);
  });

  it('should show error on missing xpi', () => {
    cli.parse([]);
    assert.ok(this.fakeFail.calledWithMatch(
      'Not enough non-option arguments'));
  });

  it('should show error if incorrect type', () => {
    cli.parse(['-t', 'false', 'whatevs']);
    assert.ok(
      this.fakeFail.calledWithMatch(
        'Invalid values:\n  Argument: type, Given: "false"'));
  });

  it('should show error if incorrect output', () => {
    cli.parse(['-o', 'false', 'whatevs']);
    assert.ok(
      this.fakeFail.calledWithMatch(
        'Invalid values:\n  Argument: output, Given: "false"'));
  });

  it('should use 78 as a width if process.stdout.columns is undefined', () => {
    var fakeProcess = null;
    assert.equal(_terminalWidth(fakeProcess), 78);
    fakeProcess = {stdout: null};
    assert.equal(_terminalWidth(fakeProcess), 78);
    fakeProcess = {stdout: {columns: null}};
    assert.equal(_terminalWidth(fakeProcess), 78);
  });

  it('should always use a positive terminal width', () => {
    var fakeProcess = {stdout: {columns: 1}};
    assert.equal(_terminalWidth(fakeProcess), 10);
  });

  it('should not use a width under 10 columns', () => {
    var fakeProcess = {stdout: {columns: 12}};
    assert.equal(_terminalWidth(fakeProcess), 10);

    fakeProcess = {stdout: {columns: 11}};
    assert.equal(_terminalWidth(fakeProcess), 10);

    fakeProcess = {stdout: {columns: 79}};
    assert.equal(_terminalWidth(fakeProcess), 77);
  });

  it('should use a terminal width of $COLUMNS - 2', () => {
    var fakeProcess = {stdout: {columns: 170}};
    assert.equal(_terminalWidth(fakeProcess), 168);
  });

});
