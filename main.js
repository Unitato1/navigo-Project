const draw_tree_id = document.getElementById("draw-tree");
draw_tree_id.addEventListener("click", () => {
  draw_tree(g_data, "");
});

const search = document.getElementById("search");
const search_text = document.getElementById("search-text");
search.addEventListener("click", () => {
  let value = search_text.value;
  let path = find_path(g_data, [], value);
  if (path !== undefined) {
    draw_path(path);
  }
});

const padding = 15;
let translate = {
  FINISHED: "hotovo",
  ACTIVE: "aktivní",
  CANCELLED: "zrušeno",
};
let types = {};
const colors = [
  "#8CB369", // Soft Sage for ALLOCATION
  "#C0D9AF", // Celadon Green for PLANNED_INCOME
  "#A3E4D7", // Turquoise Green for PROJECT
  "#D4A5A5", // Misty Rose for SUBDELIVERY
  "#B0C4DE", // Light Steel Blue for WBS_ELEMENT
  "#F5DEB3", // Wheat for WORK_TYPE_PLAN
];
let indx_color = 0;
const tree = document.getElementById("tree");

function draw_tree(data, prefix) {
  clear_tree();
  draw_tree_rec(data, prefix);
}

function draw_tree_rec(data, prefix) {
  // we could also just hard code values, but this works for any number of types,
  // if there more then six we generate random colors
  if (types[data.type] === undefined) {
    types[data.type] = chooce_Color();
    console.log(types);
  }
  createTask(data, prefix);
  let count_child = 1;
  data.children.forEach((child) => {
    // after root task
    if (prefix == "") {
      draw_tree_rec(child, prefix + count_child);
    } else {
      draw_tree_rec(child, prefix + "." + count_child);
    }
    count_child++;
  });
}

function draw_path(path) {
  let prefix = "";
  clear_tree();
  let last = undefined;
  for (let i = 0; i < path.length; i++) {
    let child = path[i];
    if (last !== undefined) {
      let task_number = last.children.indexOf(child) + 1;
      if (prefix === "") {
        prefix += task_number;
      } else {
        prefix += "." + task_number;
      }
    }
    createTask(child, prefix);
    last = child;
  }
}

function createTask(data, prefix) {
  const container = document.createElement("div");
  const name = document.createElement("h2");
  const state = document.createElement("h2");
  const budget = document.createElement("h2");
  let curr_margin = without_dot(prefix).length * padding;

  budget.textContent = data.moneyProjectPartState.plannedValue;
  budget.className = "money";

  name.textContent = prefix + " " + data.name;
  name.className = "name";

  state.textContent = translate[data.state];
  state.className = "state";

  container.style.marginLeft = curr_margin + "px";
  container.style.background = types[data.type];
  container.append(name, state, budget);
  container.className = "container";

  tree.append(container);
}

function clear_tree() {
  while (tree.firstChild) {
    tree.removeChild(tree.firstChild);
  }
}

function without_dot(word) {
  let new_word = "";
  for (i = 0; i < word.length; i++)
    if (word[i] != ".") {
      new_word += word[i];
    }
  return new_word;
}

function chooce_Color() {
  if (indx_color >= colors.length) {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
  const color = colors[indx_color];
  indx_color++;
  return color;
}

function find_path(data, path, value) {
  // return first instance of data that has name === value.
  path.push(data);
  if (data.name === value) {
    return path;
  }
  for (let i = 0; i < data.children.length; i++) {
    const child = data.children[i];
    // [...path] create copy of path till now, otherwise we would create
    // one big array of nonsense.
    result = find_path(child, [...path], value);
    if (result !== undefined) {
      return result;
    }
  }
  return undefined;
}

draw_tree_rec(g_data, "");
