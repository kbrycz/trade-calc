    
    // Variables
    var team1Score = 0
    var team2Score = 0
    var team1 = new Array()
    var team2 = new Array()
    // Initialize team scores
    updateTeamScore(1, 0)
    updateTeamScore(2, 0)

    // Initialize playerbox
    updateTeam(1, null)
    updateTeam(2, null)

    // Read in json and turn it into js obj
    fetch("player-list.json")
        .then(response => response.json())
        .then(data => {
            autocomplete(document.getElementById("team1input"), data, 1);
            autocomplete(document.getElementById("team2input"), data, 2);
    })

    // Deletes player from current team list
    function deletePlayer(team, index) {
        let playerScore = 0
        if (team === 1) {
            playerScore = team1[index].dynasty
            team1.splice(index, 1)
        } else {
            playerScore = team2[index].dynasty
            team2.splice(index, 1)
        }

        updateTeamScore(team, playerScore * -1)
        updateTeamList(team)
    }

    // Function updates the team score based on team (1 or 2) and amount (whatever player value is)
    function updateTeamScore(team, amount) {
        let targetDiv = null
        if (team === 1) {
            team1Score += amount
            targetDiv = document.getElementById("team1-score").innerHTML = "<p class='team-score'>" + team1Score + "</p>"
        } else {
            team2Score += amount
            targetDiv = document.getElementById("team2-score").innerHTML = "<p class='team-score'>" + team2Score + "</p>"
        }

        let diff = Math.abs(team1Score - team2Score)
        if (team1Score === 0 || team2Score === 0) {
            document.getElementById("messageTextContainer").innerHTML = "<h4 class='messageText'>Let's get trading!</h4>"
            return
        }
        switch (true) {
            case diff < 100:
                document.getElementById("messageTextContainer").innerHTML = "<h4 class='messageText'>This is a fair trade!</h4>"
                break;
            case diff < 500:
                if (team1Score > team2Score) {
                    document.getElementById("messageTextContainer").innerHTML = "<h4 class='messageText'>This trade is better for team 1</h4>"
                } else {
                    document.getElementById("messageTextContainer").innerHTML = "<h4 class='messageText'>This trade is better for team 2</h4>"
                }
                break;
            case diff < 1000:
                if (team1Score > team2Score) {
                    document.getElementById("messageTextContainer").innerHTML = "<h4 class='messageText'>This trade is much better for team 1</h4>"
                } else {
                    document.getElementById("messageTextContainer").innerHTML = "<h4 class='messageText'>This trade is much better for team 2</h4>"
                }
                break;
            default:
                if (team1Score > team2Score) {
                    document.getElementById("messageTextContainer").innerHTML = "<h4 class='messageText'>Team 1 is ripping team 2 off badly</h4>"
                } else {
                    document.getElementById("messageTextContainer").innerHTML = "<h4 class='messageText'>Team 2 is ripping team 1 off badly</h4>"
                }
                break;
        }
    }

    function updateTeamList(team) {
        let targetDiv = null
        let id = "team" + team + "-list"
        let list = []

        if (team === 1) {
            // Get all team members
            for (index in team1) {
                const deletePlayerStr = `deletePlayer(${team}, ${index})`
                const element = "<div class='playerRow'><button onclick='" + deletePlayerStr + "' name='delete' type='button' class='deletePlayerButton'>X</button><li class='playerNameItem'>" + team1[index].name + "</li><h5 class='playerScore'>" + team1[index].dynasty + "</h5></div>"
                list.push(element)
            }
        } else {
            // Get all team members
            for (index in team2) {
                const deletePlayerStr = `deletePlayer(${team}, ${index})`
                const element = "<div class='playerRow'><button onclick='" + deletePlayerStr + "' name='delete' type='button' class='deletePlayerButton'>X</button><li class='playerNameItem'>" + team2[index].name + "</li><h5 class='playerScore'>" + team2[index].dynasty + "</h5></div>"
                list.push(element)
            }
        }

        if (list.length === 0) {
            document.getElementById(id).innerHTML = "<p class='team-list'>Add players to the trade!</p>"
            return
        }

        // Update the list of players
        let str = "<ul>"
        for (row in list) {
            str += list[row]
        }
        str += "</ul>"
        targetDiv = document.getElementById(id).innerHTML = str
    }

    function updateTeam(team, player) {
        let targetDiv = null
        let id = "team" + team + "-list"
        if (!player) {
            targetDiv = document.getElementById(id).innerHTML = "<p class='team-list'>Add players to the trade!</p>"
            return
        }
        
        // If player is not null
        let list = []

        if (team === 1) {
            team1.push(player)
            
            // Get all team members
            for (index in team1) {
                const deletePlayerStr = `deletePlayer(${team}, ${index})`
                const element = "<div class='playerRow'><button onclick='" + deletePlayerStr + "' name='delete' type='button' class='deletePlayerButton'>X</button><li class='playerNameItem'>" + team1[index].name + "</li><h5 class='playerScore'>" + team1[index].dynasty + "</h5></div>"
                list.push(element)
            }
        } else {
            team2.push(player)
            // Get all team members
            for (index in team2) {
                const deletePlayerStr = `deletePlayer(${team}, ${index})`
                const element = "<div class='playerRow'><button onclick='" + deletePlayerStr + "' name='delete' type='button' class='deletePlayerButton'>X</button><li class='playerNameItem'>" + team2[index].name + "</li><h5 class='playerScore'>" + team2[index].dynasty + "</h5></div>"
                list.push(element)
            }
        }

        // Update the list of players
        let str = "<ul>"
        for (row in list) {
            str += list[row]
        }
        str += "</ul>"
        targetDiv = document.getElementById(id).innerHTML = str
    }

    function autocomplete(inp, players, team) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;

        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            var a, b, i, val = this.value;

            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;

            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");

            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);

            /*for each item in the array...*/
            for (const player in players) {

                /*check if the item starts with the same letters as the text field value:*/
                if (players[player].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {

                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");

                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + players[player].name.substr(0, val.length) + "</strong>";
                    b.innerHTML += players[player].name.substr(val.length);

                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + players[player].name + "'>";

                    b.innerHTML += "<p class='player-info'>(" + players[player].team + "  ·  #" + players[player].number + "  ·  " + players[player].dynasty + ")</p>"

                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function(e) {

                        /*Clear the text input after click*/
                        inp.value = ""

                        /* Update total score and player array*/
                        updateTeamScore(team, players[player].dynasty)
                        updateTeam(team, players[player])

                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });

                    a.appendChild(b);
                }
            }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;

        /*and and make the current item more visible:*/
        addActive(x);
        } else if (e.keyCode == 38) { //up

        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;

        /*and and make the current item more visible:*/
        addActive(x);
        } 
        else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {

        /*a function to classify an item as "active":*/
        if (!x) return false;

        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);

        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {

        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {

        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
    }