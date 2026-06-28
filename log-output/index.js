// generate random string once (strips 0. from random number)
const randomString = Math.random().toString(36).slice(2);

const main = () => {
  const now = new Date();
  console.log(`${now.toISOString()}: ${randomString}`);

  // keep alive
  setTimeout(main, 5000);
};

main();
