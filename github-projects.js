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

console.log(repos);

if ($pagehead_actions) {
  var url = window.location.href;
  var $button;

  if (already_saved(url)) {
    $button = document.createElement('button');
    $button.textContent = "Remove Repo";
    $button.classList.add('btn');
    $button.classList.add('btn-sm');

    $button.addEventListener('click', function() {
      var index;

      repos.forEach(function(repo, i) {
        if (repo.url == url) {
          index = i;
        }
      });

      repos.splice(index, 1);
      localStorage.setItem(key, JSON.stringify(repos));

      alert('repo remove!');
    });
  } else {
    $button = document.createElement('button');
    $button.textContent = "Save Repo";
    $button.classList.add('btn');
    $button.classList.add('btn-sm');

    $button.addEventListener('click', function() {
      var repo = {
        url: url
      };
      repos.push(repo);

      localStorage.setItem(key, JSON.stringify(repos));

      alert('repo saved!');
    });
  }

  var $li = document.createElement('li');
  $li.appendChild($button);
  $pagehead_actions.appendChild($li);
}

var $account_switcher = document.querySelector('.account-switcher');

if ($account_switcher && repos.length > 0) {
  var $repos = document.createElement('ul');

  repos.forEach(function(repo) {
    var $li = document.createElement('li');
    $li.innerHTML = '<a href="' + repo.url + '">' + repo.url + '</a>';
    $repos.appendChild($li);
  });

  $account_switcher.appendChild($repos);
}
