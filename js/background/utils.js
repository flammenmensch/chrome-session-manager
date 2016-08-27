export function promisify(namespace, methodName, ...args) {
  return new Promise((resolve, reject) => {
    const callback = function(response) {
      if (chrome.runtime.lastError) {
        return reject('API Error:', chrome.runtime.lastError);
      }
      resolve(response)
    };
    namespace[methodName].apply(namespace, [ ...args, callback ]);
  });
}
