class node {
    constructor(x, y, group) {
        this.x = x;
        this.y = y;
        this.group = group;
    }
}

var cur_stat;
var arrNode = new Array();
var centroid;
var group_num = 0;

function add(a, b) {
    return a + b;
}

function set_group(val) {
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
    group_num = 0;
    for (i = 0; i < 20; i++) {
        var tag = document.createElement("tr");
        tag.setAttribute("id", "row " + i);
        document.getElementById("board").appendChild(tag);
        for (j = 0; j < 55; j++) {
            var tag = document.createElement("td");
            tag.setAttribute("class", "grid");
            tag.setAttribute("id", i + "-" + j);
            tag.addEventListener("click", function () {
                cur_stat = this.id;
                coords = this.id.split('-');
                y = coords[0];
                x = coords[1];
                if (this.className == "grid") {
                    this.className = "node";
                    arrNode.push(new node(x, y, 0));
                } else {
                    this.className = "grid";
                    for (var k = 0; k < arrNode.length; k++) {
                        if (arrNode[k].x == x && arrNode[k].y == y) {
                            arrNode.splice(k, 1);
                            console.log(x + "-" + y);
                        }
                    }
                }
            });
            tag.addEventListener("mousedown", function () {
                cur_stat = this.id;
            });
            tag.addEventListener("mouseenter", function () {
                if (mouseDown == true) {
                    coords = this.id.split('-');
                    y = coords[0];
                    x = coords[1];
                    if (this.id != cur_stat) {
                        if (this.className == "grid") {
                            this.className = "node";
                            arrNode.push(new node(x, y, 0));
                        } else {
                            this.className = "grid";
                            for (var k = 0; k < arrNode.length; k++) {
                                if (arrNode[k].x == x && arrNode[k].y == y) {
                                    arrNode.splice(k, 1);
                                    console.log(x + "-" + y);
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
}

function reset_grid() {
    grid = document.getElementById("board").getElementsByTagName("td");
    for (var i = 0; i < grid.length; i++) {
        grid[i].setAttribute("class", "grid");
    }
}

function scatter_data() {
    if (group_num > 0) {
        reset_grid();
        arrNode = new Array();
        for (var i = 0; i < 50; i++) {
            x = Math.floor(Math.random() * 55);
            y = Math.floor(Math.random() * 20);
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
            } while (arrNode[index].group != 0)
            category = i + 1;
            arrNode[index].group = category;
            address = arrNode[index].y + "-" + arrNode[index].x;
            data = document.getElementById(address);
            data.setAttribute("class", "group" + category);
            centroid.push([arrNode[index].x, arrNode[index].y]);
        }
    } else {
        btn = document.getElementById("btn-visualize");
        btn.innerHTML = "Set Number of Group";
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
        group=i+1;
        data = document.getElementById(address);
        data.setAttribute("class","centroid"+group);
        console.log("centoid "+group+" "+address);
    }
}
function reestimate_group(node, centroid) {
    if (node != null) {
        dist = 100;
        group = node.group;
        for (var i = 0; i < centroid.length; i++) {
            centroid_x = centroid[i][0];
            centroid_y = centroid[i][1];
            dist_centroid = Math.abs(node.x - centroid_x) + Math.abs(node.y - centroid_y);
            if (dist_centroid < dist) {
                dist = dist_centroid;
                group = i + 1;
            }
        }
        node.group = group;
        address = node.y + "-" + node.x;
        data = document.getElementById(address);
        data.setAttribute("class", "group" + group);        
    }
}

function visualize_k_means() {
    console.log(arrNode.length);
    var ctr = 0;
    var cycle=0;
    var myvar = setInterval(function () {
        console.log(ctr);
        reestimate_group(arrNode[ctr], centroid);
        ctr += 1;
        
        if(ctr==arrNode.length){
                clearInterval(myvar);
                recalibrate_centroid(group_num, centroid);
            }
        // if (ctr == arrNode.length && convergent==false) {
        //     ctr=0;
        // }
        // else if(ctr==arrNode.length &&convergent==true){
        //     clearInterval(myvar);
        // }
    }, 50);

    
    console.log(cycle);

}

// function testTimer() {

//     axes = document.getElementsByClassName("node");
//     ctr = 0;
//     myvar = setInterval(function () {
//         axes[ctr].setAttribute("class", "group1");
//         console.log(axes[ctr]);
//     }, 1000);
//     if (ctr == axes.length) {
//         clearInterval(myvar);
//     }
// }

// function stopTimer() {
//     clearInterval(myvar);
// }

