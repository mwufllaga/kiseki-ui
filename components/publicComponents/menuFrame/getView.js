const getView = function(url) {
  const view = require("@/"+url);
  return view.default;
};
export default getView;
