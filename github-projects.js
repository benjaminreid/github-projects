const debug_mode = false;

var $pagehead_actions = document.querySelector('.pagehead-actions');
var key = 'github-projects';
var repos = [];


chrome.storage.sync.get(key, function(items) {
  repos = items[key] || [];
  log('got repos', repos);
  render_repos();
  render_buttons();
});

function already_saved(url) {
  var in_array = false;

  repos.forEach(function(repo) {
    if (repo.url == url) {
      in_array = true;
    }
  });

  return in_array;
}

function render_buttons() {
  if ($pagehead_actions) {
    var url = window.location.href;
    var repo_name = document.querySelector('.repohead-details-container h1 [itemprop="name"]').innerText;

    // remove button
    var $remove = document.createElement('button');
    $remove.textContent = "Remove Repo";
    $remove.classList.add('btn');
    $remove.classList.add('btn-sm');

    $remove.addEventListener('click', function() {
      var index;

      repos.forEach(function(repo, i) {
        if (repo.url == url) {
          index = i;
        }
      });

      repos.splice(index, 1);

      chrome.storage.sync.set({ 'github-projects': repos }, function() {
        log('repos saved with chrome sync', repos)
      });

      $add.style.display = "";
      $remove.style.display = "none";
    });


    var $add = document.createElement('button');
    $add.textContent = "Save Repo";
    $add.classList.add('btn');
    $add.classList.add('btn-sm');

    $add.addEventListener('click', function() {
      var $entry_title = document.querySelector('.repohead-details-container h1');
      var repo = {
        url: url,
        name: repo_name,
        is_private: $entry_title.classList.contains('private'),
        is_public: $entry_title.classList.contains('public'),
        is_fork: $entry_title.querySelector('svg').classList.contains('octicon-repo-forked')
      };
      repos.push(repo);

      log('attempt sync');
      chrome.storage.sync.set({ 'github-projects': repos }, function() {
        log('Chrome sync items!', repos);
      });

      $add.style.display = "none";
      $remove.style.display = "";
    });

    if (already_saved(url)) {
      $add.style.display = "none";
    } else {
      $remove.style.display = "none";
    }

    var $li = document.createElement('li');
    $li.appendChild($add);
    $li.appendChild($remove);
    $pagehead_actions.appendChild($li);
  }
}

function render_repos() {
  var $dashboard_sidebar = document.querySelector('.dashboard-sidebar');

  if ($dashboard_sidebar && repos.length > 0) {
    var $saved_repos = document.createElement('div');
    $saved_repos.classList.add('boxed-group', 'flush');

    var $heading = document.createElement('h3');
    $heading.textContent = "Saved repos";
    $saved_repos.appendChild($heading);

    var $repos = document.createElement('ul');
    $repos.classList.add('boxed-group-inner', 'mini-repo-list');

    repos.forEach(function(repo) {
      var $li = document.createElement('li');
      $li.classList.add('source');
      if (repo.is_public) $li.classList.add('public');
      if (repo.is_private) $li.classList.add('private');

      var $a = document.createElement('a');
      $a.setAttribute('href', repo.url);
      $a.classList.add('mini-repo-list-item', 'css-truncate');
      if (repo.is_fork) $a.appendChild(create_fork_repo_svg());
      else {
        if (repo.is_private) $a.appendChild(create_private_repo_svg());
        if (repo.is_public) $a.appendChild(create_public_repo_svg());
      }

      $repo_and_owner = document.createElement('span');
      $repo_and_owner.classList.add('repo-and-owner', 'css-truncate-target');

      $owner = document.createElement('span');
      $owner.classList.add('owner');
      $owner.textContent = repo.url.replace(/https?:\/\/github.com\/(.*)\/.*/, '$1');

      $repo = document.createElement('span');
      $repo.classList.add('repo', 'github-projects-css-truncate-target');
      $repo.textContent = repo.url.replace(/https?:\/\/github.com\/.*\/(.*)/, '$1');

      $repo_and_owner.appendChild($owner);
      $repo_and_owner.innerHTML += '/';
      $repo_and_owner.appendChild($repo);

      $a.appendChild($repo_and_owner);

      $li.appendChild($a);
      $repos.appendChild($li);
    });

    $saved_repos.appendChild($repos);

    $dashboard_sidebar_first_child = $dashboard_sidebar.querySelector('.boxed-group');
    $dashboard_sidebar.insertBefore($saved_repos, $dashboard_sidebar_first_child);
  }
}

function log() {
  debug_mode && console.log.apply(console, arguments);
}

var create_private_repo_svg = string_to_element.bind(null, '<svg aria-hidden="true" class="octicon octicon-lock repo-icon" height="16" role="img" version="1.1" viewBox="0 0 12 16" width="12"><path d="M4 13h-1v-1h1v1z m8-6v7c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V7c0-0.55 0.45-1 1-1h1V4C2 1.8 3.8 0 6 0s4 1.8 4 4v2h1c0.55 0 1 0.45 1 1z m-8.2-1h4.41V4c0-1.22-0.98-2.2-2.2-2.2s-2.2 0.98-2.2 2.2v2z m7.2 1H2v7h9V7z m-7 1h-1v1h1v-1z m0 2h-1v1h1v-1z"></path></svg>');
var create_public_repo_svg = string_to_element.bind(null, '<svg aria-hidden="true" class="octicon octicon-repo repo-icon" height="16" role="img" version="1.1" viewBox="0 0 12 16" width="12"><path d="M4 9h-1v-1h1v1z m0-3h-1v1h1v-1z m0-2h-1v1h1v-1z m0-2h-1v1h1v-1z m8-1v12c0 0.55-0.45 1-1 1H6v2l-1.5-1.5-1.5 1.5V14H1c-0.55 0-1-0.45-1-1V1C0 0.45 0.45 0 1 0h10c0.55 0 1 0.45 1 1z m-1 10H1v2h2v-1h3v1h5V11z m0-10H2v9h9V1z"></path></svg>');
var create_fork_repo_svg = string_to_element.bind(null, '<svg aria-hidden="true" class="octicon octicon-repo-forked repo-icon" height="16" role="img" version="1.1" viewBox="0 0 10 16" width="10"><path d="M8 1c-1.11 0-2 0.89-2 2 0 0.73 0.41 1.38 1 1.72v1.28L5 8 3 6v-1.28c0.59-0.34 1-0.98 1-1.72 0-1.11-0.89-2-2-2S0 1.89 0 3c0 0.73 0.41 1.38 1 1.72v1.78l3 3v1.78c-0.59 0.34-1 0.98-1 1.72 0 1.11 0.89 2 2 2s2-0.89 2-2c0-0.73-0.41-1.38-1-1.72V9.5l3-3V4.72c0.59-0.34 1-0.98 1-1.72 0-1.11-0.89-2-2-2zM2 4.2c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z m3 10c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z m3-10c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z"></path></svg>');

function string_to_element(html) {
  var template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstChild;
}
