var $pagehead_actions = document.querySelector('.pagehead-actions');
var key = 'github-projects';
var repos = JSON.parse(localStorage.getItem(key)) || [];

console.log(repos);

if ($pagehead_actions) {
  var $add_repo = document.createElement('button');
  $add_repo.textContent = "Save Repo";
  $add_repo.classList.add('btn');
  $add_repo.classList.add('btn-sm');

  $add_repo.addEventListener('click', function() {
    var repo = {
      url: window.location.href
    };
    repos.push(repo);

    localStorage.setItem(key, JSON.stringify(repos));

    alert('repo saved!')
  });

  var $li = document.createElement('li');
  $li.appendChild($add_repo);

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
