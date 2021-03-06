class node {
  constructor(x, y, group) {
    this.x = x;
    this.y = y;
    this.group = group;
  }
}

var cur_stat;
var arrNode = new Array();
var centroid = new Array();
var group_num = 0;
var myvar;
var ver_length = 20;
var hor_length = 55;
var initial_data_number = 50;
var visual_started = false;

function close_tutorial(){
  document.getElementById("tutorial-container").style.display = "none";
}

function set_group(val) {
  reset_grid();
  stop_cycle();
  group_num = val;
  dropdown = document.getElementsByClassName("dropdown-menu")[0];
  dropdown.style.display = "none";

  btn = document.getElementById("btn-visualize");
  btn.innerHTML = "Visualize Clustering";
}

function view_dropdown() {
  dropdown = document.getElementsByClassName("dropdown-menu")[0];
  if (dropdown.style.display == "block") {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "block";
  }
}

//estrablishing functions and generating grid
function generate() {
  //smartphone potrait
  if (window.screen.availWidth < 600) {
    hor_length = 10;
    ver_length = 15;
    initial_data_number = 25;
    document.getElementById("group-selector").innerHTML = "Groups";
    document.getElementById("arrow-icon").style.display = "none";
  }
  //tablet potrait
  else if (window.screen.availWidth > 600 && window.screen.availWidth < 770) {
    hor_length = 21;
    ver_length = 22;
    initial_data_number = 35;
    document.getElementById("group-selector").innerHTML = "Groups";
    document.getElementById("arrow-icon").style.display = "none";
  }
  //desktop
  else {
    hor_length = 55;
    ver_length = 20;
    initial_data_number = 50;
    document.getElementById("group-selector").innerHTML = "Number of Groups";
    document.getElementById("arrow-icon").style.display = "inline";
  }
  body = document.getElementById("board");
  arrNode = new Array();
  body.innerHTML = "";
  group_num = 0;
  for (i = 0; i < ver_length; i++) {
    var tag = document.createElement("tr");
    tag.setAttribute("id", "row " + i);
    document.getElementById("board").appendChild(tag);
    for (j = 0; j < hor_length; j++) {
      var tag = document.createElement("td");
      tag.setAttribute("class", "grid");
      tag.setAttribute("id", i + "-" + j);
      tag.addEventListener("click", function () {
        cur_stat = this.id;
        coords = this.id.split("-");
        y = parseInt(coords[0]);
        x = parseInt(coords[1]);
        if (arrNode.length > 0) {
          if (
            (this.className == "grid" || this.className == "grid-transition") &&
            !visual_started
          ) {
            this.className = "node";
            arrNode.push(new node(x, y, 0));
          } else if (this.className == "node" && !visual_started) {
            this.className = "grid";
            for (var k = 0; k < arrNode.length; k++) {
              if (arrNode[k].x == x && arrNode[k].y == y) {
                arrNode.splice(k, 1);
              }
            }
          }
        } else {
          alert("Select number of groups and scatter data first!");
        }
      });

      tag.addEventListener("mousedown", function () {
        cur_stat = this.id;
      });
      tag.addEventListener("mouseenter", function () {
        if (mouseDown == true) {
          coords = this.id.split("-");
          y = parseInt(coords[0]);
          x = parseInt(coords[1]);
          if (arrNode.length > 0) {
            if (this.id != cur_stat) {
              if (
                (this.className == "grid" ||
                  this.className == "grid-transition") &&
                !visual_started
              ) {
                this.className = "node";
                arrNode.push(new node(x, y, 0));
              } else if (this.className == "node" && !visual_started) {
                this.className = "grid";
                for (var k = 0; k < arrNode.length; k++) {
                  if (arrNode[k].x == x && arrNode[k].y == y) {
                    arrNode.splice(k, 1);
                  }
                }
              }
            }
          }
          cur_stat = this.id;
        }
      });
      document.getElementById("row " + i).appendChild(tag);
      // array_grid.push(new grid(j, i));
    }
  }
  var mouseDown = false;
  body = document.getElementById("board");
  body.addEventListener("mouseup", function () {
    mouseDown = false;
    cur_stat = null;
  });
  body.addEventListener("mousedown", function () {
    mouseDown = true;
  });
  cycle_view = document.getElementById("cycle_view");
  cycle_view.style.display = "none";
}

function reset_grid() {
  stop_cycle();
  visual_started = false;
  arrNode = new Array();
  grid = document.getElementById("board").getElementsByTagName("td");
  for (var i = 0; i < grid.length; i++) {
    grid[i].setAttribute("class", "grid");
  }
  document.getElementById("btn-visualize").innerHTML = "Visualize Clustering";
}

function scatter_data() {
  stop_cycle();
  btn = document.getElementById("btn-visualize");
  if (group_num > 0) {
    reset_grid();
    arrNode = new Array();
    for (var i = 0; i < initial_data_number; i++) {
      x = Math.floor(Math.random() * hor_length);
      y = Math.floor(Math.random() * ver_length);
      arrNode.push(new node(x, y, 0));
    }
    arrNode.forEach(function (item) {
      address = item.y + "-" + item.x;
      data = document.getElementById(address);
      data.setAttribute("class", "node");
    });
    centroid = new Array();
    for (var i = 0; i < group_num; i++) {
      do {
        index = Math.floor(Math.random() * arrNode.length);
      } while (arrNode[index].group != 0);
      category = i + 1;
      arrNode[index].group = category;
      address = arrNode[index].y + "-" + arrNode[index].x;
      data = document.getElementById(address);
      data.setAttribute("class", "group" + category);
      centroid.push([arrNode[index].x, arrNode[index].y]);
    }
    document.getElementById("cycle_view").innerHTML = "Cycle : " + 1;
    btn.innerHTML = "Visualize Clustering";
  } else {
    btn.innerHTML = "Set Number of Group!";
  }
}

function toggle_cycle() {
  if (window.screen.availWidth > 600) {
    cycle_view = document.getElementById("cycle_view");
    if (cycle_view.style.display == "none") cycle_view.style.display = "block";
    else cycle_view.style.display = "none";
  }
}
function stop_cycle() {
  if (myvar) {
    clearInterval(myvar);
  }
  cycle_view = document.getElementById("cycle_view");
  cycle_view.style.display = "none";
  btn = document.getElementById("btn-visualize");
  btn.disabled = false;
}
//// AI METHODS
function clear_centroid(group_num, centroid) {
  for (var i = 0; i < group_num; i++) {
    centroid_x = centroid[i][0];
    centroid_y = centroid[i][1];
    address = centroid_y + "-" + centroid_x;
    data = document.getElementById(address);
    cur_category = i + 1;
    a_node = false;
    arrNode.forEach(function (item) {
      if (item.x == centroid_x && item.y == centroid_y) {
        data.setAttribute("class", "group" + item.group);
        a_node = true;
      }
    });
    if (!a_node) {
      data.setAttribute("class", "grid-transition");
    }
  }
}
function recalibrate_centroid(group_num, centroid) {
  for (var i = 0; i < group_num; i++) {
    cur_category = i + 1;
    cur_x = 0;
    cur_y = 0;
    num_member = 0;
    arrNode.forEach(function (item) {
      if (item.group == cur_category) {
        cur_x += item.x;
        cur_y += item.y;
        num_member += 1;
      }
    });
    cur_x /= num_member;
    cur_y /= num_member;
    cur_x = Math.round(cur_x);
    cur_y = Math.round(cur_y);
    centroid[i] = [cur_x, cur_y];
    address = cur_y + "-" + cur_x;
    data = document.getElementById(address);
    data.setAttribute("class", "centroid" + cur_category);
  }
}
function reestimate_group(node, centroid, convergent) {
  if (node != null) {
    dist = 100;
    group = node.group;
    for (var i = 0; i < centroid.length; i++) {
      centroid_x = centroid[i][0];
      centroid_y = centroid[i][1];
      dist_centroid = Math.round(
        Math.sqrt(
          Math.pow(node.x - centroid_x, 2) + Math.pow(node.y - centroid_y, 2)
        )
      );
      if (dist_centroid < dist) {
        dist = dist_centroid;
        new_group = i + 1;
      }
    }
    if (group != new_group) {
      convergent = false;
    }
    node.group = new_group;
    address = node.y + "-" + node.x;
    data = document.getElementById(address);
    data.setAttribute("class", "group" + new_group);
  }
  return convergent;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex != 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function visualize_k_means() {
  if (group_num > 0 && arrNode.length > 0) {
    visual_started = true;
    btn = document.getElementById("btn-visualize");
    shuffle(arrNode);
    btn.disabled = true;
    toggle_cycle();
    var ctr = 0;
    var cycle = 1;
    var convergent = true;
    myvar = setInterval(function () {
      convergent = reestimate_group(arrNode[ctr], centroid, convergent);
      ctr += 1;
      if (ctr == arrNode.length) {
        setTimeout(function () {
          clear_centroid(group_num, centroid);
        }, 400);

        if (convergent) {
          clearInterval(myvar);
          document.getElementById("cycle_view").innerHTML =
            "Cycle : " + cycle + " (Finished)";
          document.getElementById("btn-visualize").innerHTML =
            "Clustering Finished";
        } else {
          setTimeout(function () {
            recalibrate_centroid(group_num, centroid);
            cycle += 1;
            document.getElementById("cycle_view").innerHTML =
              "Cycle : " + cycle;
          }, 1200);
          setTimeout(function () {
            convergent = true;
            ctr = 0;
          }, 2300);
        }
      }
    }, 50);
  } else if (group_num <= 0) {
    btn = document.getElementById("btn-visualize");
    btn.innerHTML = "Set Number of Group!";
  } else if (arrNode.length <= 0) {
    btn = document.getElementById("btn-visualize");
    btn.innerHTML = "Scatter Data First!";
  }
}
