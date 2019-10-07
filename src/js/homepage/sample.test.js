import sample from './sample';

const sampleFn = new sample(3);

describe('sample function', () => {
  test('adds 3 + 2 to equal 5 and returns result', () => {
    expect(sampleFn.getResult()).toBe('The result is 5');
  });
});
