worldData = []

worldData.push({
  name: 'Eden',
  levelData: [{
    name: 'Welcome',
    x: -10,
    y: 5,
    defaultExpression: '-16/(1+((x-32)/4)^2)',
    goals: [
      {
        x: 4,
        y: 0.5
      }
    ],
    sledders: [{
      
    }],
  },
  {
    name: 'Constants',
    x: 15,
    y: 0,
    defaultExpression: '-1',
    goals: [
      {
        x: 0,
        y: 3.5
      }
    ],
    sledders: [{
      
    }],
  },
  {
    name: 'A Simple Slope',
    x: 0,
    y: -15,
    defaultExpression: 'x',
    goals: [
      {
        x: 2,
        y: -2
      },
      {
        x: 4,
        y: -4
      },
      {
        x: 6,
        y: -6
      }
    ],
    sledders: [{
      
    }],
  },
  {
    name: 'A Steeper Slope',
    x: -5,
    y: -10,
    defaultExpression: 'x * -1',
    goals: [
      {
        x: 2,
        y: -4
      },
      {
        x: 4,
        y: -8
      },
      {
        x: 6,
        y: -12
      }
    ],
    sledders: [{
      
    }],
  },
  {
    name: 'A Shallower Slope',
    x: 0,
    y: -20,
    defaultExpression: 'x * -2',
    goals: [
      {
        x: 2,
        y: -1
      },
      {
        x: 4,
        y: -2
      },
      {
        x: 6,
        y: -3
      }
    ],
    sledders: [{
      
    }],
  },
  {
    name: 'Raising & Lowering',
    x: -15,
    y: -15,
    defaultExpression: 'x/-2 + 2',
    goals: [
      {
        x: 3,
        y: -3
      },
      {
        x: 6,
        y: -4
      },
      {
        x: 9,
        y: -5
      },
      {
        x: 12,
        y: -6
      },
      {
        x: 15,
        y: -7
      },
      {
        x: 18,
        y: -8
      },
      {
        x: 21,
        y: -9
      }
    ],
    sledders: [{
      
    }],
  }],
})