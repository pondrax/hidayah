import { PUBLIC_URL } from '$env/static/public';
// if(process.env.VERCEL_URL){

//   console.log(process)
// }
export const intersect = () => {
  const intersectionObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) =>
        entry.target.dispatchEvent(new CustomEvent('intersect', { detail: entry }))
      ),
    { root: null, rootMargin: '100px', threshold: 0.5 }
  );

  const mutationObserver = new MutationObserver((mutations) =>
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (
          node instanceof HTMLElement &&
          node.dataset.intersect != null &&
          node.dataset.intersectInitialized == null
        ) {
          intersectionObserver.observe(node);
          node.dataset.intersectInitialized = 'true';
        }
      });
      m.removedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          intersectionObserver.unobserve(node);
        }
      });
    })
  );
  let intersected = document.querySelectorAll('[data-intersect]');
  [...intersected].forEach((node: any) => {
    intersectionObserver.observe(node);
    node.dataset.intersectInitialized = 'true';
  });
  if (intersected[0]?.parentNode instanceof Node) {
    mutationObserver.observe(intersected[0]?.parentNode, {
      childList: true,
      subtree: true
    });
  }

  return () => {
    mutationObserver.disconnect();
    intersectionObserver.disconnect();
  };
};

export const stores = async (...name: any) => {
  let url = PUBLIC_URL + '/store/' + ([...name].join('/'));
  console.log(url)
  return await (await (fetch(url))).json()
  // return path.join(process.cwd(), '/static/store', ...name);
}