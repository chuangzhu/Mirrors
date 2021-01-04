"use strict";

window.addEventListener("load", () => {
    fetch("/static/status.json").then(res => {
        return res.json();
    }).then(json => {
        renderList(json);
    });
});

const official_mirrors = ["archlinux","archlinuxcn","kicad","ubuntu","ubuntu-releases","CTAN"];
const official_mirrors_span = ' <span class="label label-official">official</span> ';

function stringInArray(arr, str) {
    return (arr.indexOf(str) > -1);
}

function renderList(data) {
    function getImportance(state) {
        switch (state) {
            case "success":
                return 1;

            case "syncing":
                return 2;

            case "paused":
                return 3;

            case "failed":
                return 4;
        }
    }

    data.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    data.sort((a, b) => {
        return getImportance(a.status) - getImportance(b.status);
    });
    const model = document.querySelector("#model");
    const table = document.querySelector(".mirror-table");
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const node = model.cloneNode(true);
        node.setAttribute("href", "/" + item.name);
        node.id = "data" + i;
	    let distro_name = stringInArray(official_mirrors, item.name) ? item.name + official_mirrors_span : item.name;
        node.querySelector(".distro-name").innerHTML = distro_name;
        setSyncingState(node.querySelector(".status"), item.status);
        node.querySelector(".last-update").innerHTML = stringifyTime(item.last_update_ts);
        node.querySelector(".update-schedule").innerHTML = stringifyTime(item.next_schedule_ts);
        setProtocol(node.querySelector(".upstream"), item.upstream);
        node.querySelector(".size").innerHTML = item.size;
        table.lastElementChild.appendChild(node);
        node.addEventListener("mouseup", () => {
            window.open("/" + item.name + "/");
        });
    }
}

function setSyncingState(el, res) {
    switch (res) {
        case "success":
            el.innerHTML = "<i class=\"tick\"></i>";
            el.classList.add("success");
            break;

        case "syncing":
            el.innerHTML = "<i class=\"spinner\"></i>";
            break;

        case "paused":
            el.innerHTML = "<i class=\"paused\"></i>";
            break;

        case "failed":
            el.innerHTML = "<i class=\"error\"></i>";
            el.classList.add("failed");
            break;
    }
}

function setProtocol(el, res) {
    el.setAttribute("prompt", res);
    el.innerHTML = "<a href=\"" + res + "\">" + res.split(":")[0] + "</a>";
}

function stringifyTime(ts) {
    let date = new Date(ts * 1000);
    let str = "";
    if (date.getFullYear() > 2000) {
      str = ('000' + date.getFullYear()).substr(-4) + "-" + ('0' + (date.getMonth() + 1)).substr(-2) + "-" + ('0' + date.getDate()).substr(-2) + (" " + ('0' + date.getHours()).substr(-2) + ":" + ('0' + date.getMinutes()).substr(-2));
    } else {
      str = "0000-00-00 00:00";
    }
    return str;
};
