var $pagehead_actions = document.querySelector('.pagehead-actions');
var key = 'github-projects';
var repos = JSON.parse(localStorage.getItem(key)) || [];

function already_saved(url) {
  var in_array = false;

  repos.forEach(function(repo) {
    if (repo.url == url) {
      in_array = true;
    }
  });

  return in_array;
}

console.log('github-projects:debug', repos);

if ($pagehead_actions) {
  var url = window.location.href;

  // add button
  var $add = document.createElement('button');
  $add.textContent = "Remove Repo";
  $add.classList.add('btn');
  $add.classList.add('btn-sm');

  $add.addEventListener('click', function() {
    var index;

    repos.forEach(function(repo, i) {
      if (repo.url == url) {
        index = i;
      }
    });

    repos.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(repos));

    $remove.style.display = "";
    $add.style.display = "none";

    console.log('github-projects:debug', repos);
  });


  var $remove = document.createElement('button');
  $remove.textContent = "Save Repo";
  $remove.classList.add('btn');
  $remove.classList.add('btn-sm');

  $remove.addEventListener('click', function() {
    var repo = {
      url: url
    };
    repos.push(repo);

    localStorage.setItem(key, JSON.stringify(repos));

    $remove.style.display = "none";
    $add.style.display = "";

    console.log('github-projects:debug', repos);
  });

  if (already_saved(url)) {
    $remove.style.display = "none";
  } else {
    $add.style.display = "none";
  }

  var $li = document.createElement('li');
  $li.appendChild($add);
  $li.appendChild($remove);
  $pagehead_actions.appendChild($li);
}

var $account_switcher = document.querySelector('.account-switcher');

if ($account_switcher && repos.length > 0) {
  var $heading = document.createElement('h2');
  $heading.textContent = "Saved repos";
  var $repos = document.createElement('ul');
  $repos.classList.add('repos-list');

  repos.forEach(function(repo) {
    var $li = document.createElement('li');
    $li.innerHTML = '<a href="' + repo.url + '">' + repo.url + '</a>';
    $repos.appendChild($li);
  });

  $account_switcher.appendChild($heading);
  $account_switcher.appendChild($repos);
}
