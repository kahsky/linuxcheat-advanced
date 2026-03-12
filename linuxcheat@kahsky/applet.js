const St = imports.gi.St;
const GLib = imports.gi.GLib;
const Applet = imports.ui.applet;
const PopupMenu = imports.ui.popupMenu;
const Settings = imports.ui.settings;

const UUID = "linuxcheat@kahsky";

// ─── Couleurs par catégorie (clé interne) ──────────────────────────────────────
const CAT_COLORS = {
    "system":      "#e74c3c",
    "files":       "#3498db",
    "network":     "#1abc9c",
    "apache":      "#9b59b6",
    "nginx":       "#e67e22",
    "mysql":       "#f1c40f",
    "php":         "#8e44ad",
    "git":         "#e8854a",
    "docker":      "#2980b9",
    "apt":         "#d35400",
    "systemd":     "#27ae60",
    "ssh":         "#16a085",
    "compression": "#7f8c8d",
    "users":       "#c0392b",
};

// ─── Commandes par thème ───────────────────────────────────────────────────────
const COMMANDS = [
    {
        key: "system",
        en: "System", fr: "Système",
        commands: [
            { en: "Restart the system",            fr: "Redémarrer",                cmd: "sudo reboot" },
            { en: "Shut down immediately",          fr: "Éteindre maintenant",        cmd: "sudo shutdown now" },
            { en: "Shut down in 10 min",            fr: "Éteindre dans 10 min",       cmd: "sudo shutdown -h +10" },
            { en: "Cancel scheduled shutdown",      fr: "Annuler l'extinction",        cmd: "sudo shutdown -c" },
            { en: "System info (uname)",            fr: "Infos système (uname)",       cmd: "uname -a" },
            { en: "Disk usage",                     fr: "Utilisation disque",          cmd: "df -h" },
            { en: "RAM usage",                      fr: "Utilisation RAM",             cmd: "free -h" },
            { en: "Active processes",               fr: "Processus actifs",            cmd: "top" },
            { en: "Process monitor (htop)",         fr: "Processus (htop)",            cmd: "htop" },
            { en: "Uptime",                         fr: "Uptime",                      cmd: "uptime" },
            { en: "Who is logged in",               fr: "Qui est connecté",            cmd: "who" },
        ]
    },
    {
        key: "files",
        en: "Files & Navigation", fr: "Fichiers & Navigation",
        commands: [
            { en: "Detailed file list",             fr: "Liste détaillée",             cmd: "ll" },
            { en: "Disk usage per item",            fr: "Taille par fichier",          cmd: "du -sh *" },
            { en: "Find a file by name",            fr: "Rechercher un fichier",       cmd: "find / -name \"fichier.txt\" 2>/dev/null" },
            { en: "Search text in files",           fr: "Rechercher dans fichiers",    cmd: "grep -r \"texte\" /chemin/" },
            { en: "Recursive copy",                 fr: "Copier récursivement",        cmd: "cp -r source/ destination/" },
            { en: "Move / Rename",                  fr: "Déplacer / Renommer",         cmd: "mv ancien nouveau" },
            { en: "Delete folder recursively",      fr: "Supprimer dossier récursif",  cmd: "rm -rf dossier/" },
            { en: "Create nested folders",          fr: "Créer dossiers imbriqués",    cmd: "mkdir -p a/b/c" },
            { en: "Follow log file (tail)",         fr: "Lire un fichier (tail)",      cmd: "tail -f /var/log/syslog" },
            { en: "Get octal permissions",          fr: "Droits en octal",             cmd: "stat -c \"%a %n\" fichier" },
            { en: "Change permissions recursively", fr: "Changer droits récursif",     cmd: "chmod -R 755 dossier/" },
            { en: "Change owner recursively",       fr: "Changer propriétaire",        cmd: "chown -R user:group dossier/" },
        ]
    },
    {
        key: "network",
        en: "Network", fr: "Réseau",
        commands: [
            { en: "Network interfaces",             fr: "Interfaces réseau",           cmd: "ip a" },
            { en: "Routing table",                  fr: "Table de routage",            cmd: "ip route" },
            { en: "Ping (4 times)",                 fr: "Ping (4 fois)",               cmd: "ping -c 4 google.com" },
            { en: "Open ports (ss)",                fr: "Ports ouverts (ss)",          cmd: "ss -tulnp" },
            { en: "Open ports (netstat)",           fr: "Ports ouverts (netstat)",     cmd: "netstat -tulnp" },
            { en: "DNS lookup",                     fr: "Résolution DNS",              cmd: "nslookup google.com" },
            { en: "Download file (wget)",           fr: "Télécharger (wget)",          cmd: "wget -c https://url/fichier" },
            { en: "HTTP request (curl)",            fr: "Requête HTTP (curl)",         cmd: "curl -I https://example.com" },
            { en: "Active connections",             fr: "Connexions actives",          cmd: "ss -s" },
            { en: "UFW firewall status",            fr: "Firewall UFW status",         cmd: "sudo ufw status verbose" },
            { en: "Allow port (UFW)",               fr: "Ouvrir port UFW",             cmd: "sudo ufw allow 80/tcp" },
        ]
    },
    {
        key: "apache",
        en: "Apache", fr: "Apache",
        commands: [
            { en: "Start Apache",                   fr: "Démarrer Apache",             cmd: "sudo systemctl start apache2" },
            { en: "Stop Apache",                    fr: "Arrêter Apache",              cmd: "sudo systemctl stop apache2" },
            { en: "Restart Apache",                 fr: "Redémarrer Apache",           cmd: "sudo systemctl restart apache2" },
            { en: "Reload Apache",                  fr: "Recharger Apache",            cmd: "sudo systemctl reload apache2" },
            { en: "Apache status",                  fr: "Statut Apache",               cmd: "sudo systemctl status apache2" },
            { en: "Enable on startup",              fr: "Activer au démarrage",        cmd: "sudo systemctl enable apache2" },
            { en: "Test Apache config",             fr: "Tester config Apache",        cmd: "sudo apache2ctl configtest" },
            { en: "Enable site",                    fr: "Activer site",                cmd: "sudo a2ensite monsite.conf" },
            { en: "Disable site",                   fr: "Désactiver site",             cmd: "sudo a2dissite monsite.conf" },
            { en: "Enable module",                  fr: "Activer module",              cmd: "sudo a2enmod rewrite" },
            { en: "Apache error logs",              fr: "Logs erreurs Apache",         cmd: "sudo tail -f /var/log/apache2/error.log" },
            { en: "Apache access logs",             fr: "Logs accès Apache",           cmd: "sudo tail -f /var/log/apache2/access.log" },
        ]
    },
    {
        key: "nginx",
        en: "Nginx", fr: "Nginx",
        commands: [
            { en: "Start Nginx",                    fr: "Démarrer Nginx",              cmd: "sudo systemctl start nginx" },
            { en: "Stop Nginx",                     fr: "Arrêter Nginx",               cmd: "sudo systemctl stop nginx" },
            { en: "Restart Nginx",                  fr: "Redémarrer Nginx",            cmd: "sudo systemctl restart nginx" },
            { en: "Reload Nginx",                   fr: "Recharger Nginx",             cmd: "sudo systemctl reload nginx" },
            { en: "Nginx status",                   fr: "Statut Nginx",                cmd: "sudo systemctl status nginx" },
            { en: "Test Nginx config",              fr: "Tester config Nginx",         cmd: "sudo nginx -t" },
            { en: "Nginx error logs",               fr: "Logs erreurs Nginx",          cmd: "sudo tail -f /var/log/nginx/error.log" },
        ]
    },
    {
        key: "mysql",
        en: "MySQL / MariaDB", fr: "MySQL / MariaDB",
        commands: [
            { en: "Start MySQL",                    fr: "Démarrer MySQL",              cmd: "sudo systemctl start mysql" },
            { en: "Stop MySQL",                     fr: "Arrêter MySQL",               cmd: "sudo systemctl stop mysql" },
            { en: "Restart MySQL",                  fr: "Redémarrer MySQL",            cmd: "sudo systemctl restart mysql" },
            { en: "MySQL status",                   fr: "Statut MySQL",                cmd: "sudo systemctl status mysql" },
            { en: "Connect as root",                fr: "Connexion root",              cmd: "sudo mysql -u root -p" },
            { en: "List databases",                 fr: "Lister les bases",            cmd: "SHOW DATABASES;" },
            { en: "Backup database",                fr: "Backup base de données",      cmd: "mysqldump -u root -p mabase > backup.sql" },
            { en: "Restore database",               fr: "Restaurer une base",          cmd: "mysql -u root -p mabase < backup.sql" },
        ]
    },
    {
        key: "php",
        en: "PHP / Composer", fr: "PHP / Composer",
        commands: [
            { en: "PHP version",                    fr: "Version PHP",                 cmd: "php -v" },
            { en: "Active PHP modules",             fr: "Modules PHP actifs",          cmd: "php -m" },
            { en: "Restart PHP-FPM 8.1",            fr: "Redémarrer PHP-FPM 8.1",      cmd: "sudo systemctl restart php8.1-fpm" },
            { en: "PHP-FPM status",                 fr: "Statut PHP-FPM",              cmd: "sudo systemctl status php8.1-fpm" },
            { en: "Composer version",               fr: "Composer version",            cmd: "composer --version" },
            { en: "Composer install",               fr: "Composer install",            cmd: "composer install" },
            { en: "Composer update",                fr: "Composer update",             cmd: "composer update" },
        ]
    },
    {
        key: "git",
        en: "Git", fr: "Git",
        commands: [
            { en: "Status",                         fr: "Statut",                      cmd: "git status" },
            { en: "Compact log",                    fr: "Log condensé",                cmd: "git log --oneline --graph" },
            { en: "Stage all",                      fr: "Ajouter tout",                cmd: "git add ." },
            { en: "Commit",                         fr: "Commit",                      cmd: "git commit -m \"message\"" },
            { en: "Push to main",                   fr: "Push origin main",            cmd: "git push origin main" },
            { en: "Pull",                           fr: "Pull",                        cmd: "git pull" },
            { en: "List branches",                  fr: "Nouvelles branches",          cmd: "git branch -a" },
            { en: "Switch branch",                  fr: "Changer branche",             cmd: "git checkout nom-branche" },
            { en: "Create new branch",              fr: "Nouvelle branche",            cmd: "git checkout -b nouvelle-branche" },
            { en: "Stash changes",                  fr: "Stash",                       cmd: "git stash" },
            { en: "Apply stash",                    fr: "Stash pop",                   cmd: "git stash pop" },
            { en: "Show diff",                      fr: "Diff",                        cmd: "git diff" },
        ]
    },
    {
        key: "docker",
        en: "Docker", fr: "Docker",
        commands: [
            { en: "List running containers",        fr: "Lister conteneurs actifs",    cmd: "docker ps" },
            { en: "List all containers",            fr: "Lister tous conteneurs",      cmd: "docker ps -a" },
            { en: "List images",                    fr: "Lister images",               cmd: "docker images" },
            { en: "Start container",                fr: "Démarrer conteneur",          cmd: "docker start nom_conteneur" },
            { en: "Stop container",                 fr: "Arrêter conteneur",           cmd: "docker stop nom_conteneur" },
            { en: "Remove container",               fr: "Supprimer conteneur",         cmd: "docker rm nom_conteneur" },
            { en: "Remove image",                   fr: "Supprimer image",             cmd: "docker rmi nom_image" },
            { en: "Follow container logs",          fr: "Logs conteneur",              cmd: "docker logs -f nom_conteneur" },
            { en: "Shell in container",             fr: "Shell dans conteneur",        cmd: "docker exec -it nom_conteneur bash" },
            { en: "Compose up (detached)",          fr: "Docker compose up",           cmd: "docker compose up -d" },
            { en: "Compose down",                   fr: "Docker compose down",         cmd: "docker compose down" },
            { en: "Compose logs",                   fr: "Docker compose logs",         cmd: "docker compose logs -f" },
        ]
    },
    {
        key: "apt",
        en: "Packages APT", fr: "Packages APT",
        commands: [
            { en: "Update package list",            fr: "Mettre à jour les listes",    cmd: "sudo apt update" },
            { en: "Upgrade all packages",           fr: "Mettre à jour les paquets",   cmd: "sudo apt upgrade -y" },
            { en: "Install a package",              fr: "Installer un paquet",         cmd: "sudo apt install nom_paquet" },
            { en: "Remove a package",               fr: "Supprimer un paquet",         cmd: "sudo apt remove nom_paquet" },
            { en: "Purge a package",                fr: "Purger un paquet",            cmd: "sudo apt purge nom_paquet" },
            { en: "Clean APT cache",                fr: "Nettoyer cache APT",          cmd: "sudo apt autoremove && sudo apt autoclean" },
            { en: "Search for a package",           fr: "Chercher un paquet",          cmd: "apt search nom_paquet" },
            { en: "Package details",                fr: "Infos sur un paquet",         cmd: "apt show nom_paquet" },
        ]
    },
    {
        key: "systemd",
        en: "Systemd / Services", fr: "Systemd / Services",
        commands: [
            { en: "List running services",          fr: "Lister services actifs",      cmd: "systemctl list-units --type=service --state=running" },
            { en: "Start service",                  fr: "Démarrer service",            cmd: "sudo systemctl start nom_service" },
            { en: "Stop service",                   fr: "Arrêter service",             cmd: "sudo systemctl stop nom_service" },
            { en: "Restart service",                fr: "Redémarrer service",          cmd: "sudo systemctl restart nom_service" },
            { en: "Service status",                 fr: "Statut service",              cmd: "sudo systemctl status nom_service" },
            { en: "Enable on startup",              fr: "Activer au démarrage",        cmd: "sudo systemctl enable nom_service" },
            { en: "Disable on startup",             fr: "Désactiver au démarrage",     cmd: "sudo systemctl disable nom_service" },
            { en: "Reload daemon",                  fr: "Recharger daemon",            cmd: "sudo systemctl daemon-reload" },
            { en: "Follow service logs",            fr: "Logs journalctl",             cmd: "sudo journalctl -u nom_service -f" },
            { en: "Logs since boot",                fr: "Logs depuis boot",            cmd: "sudo journalctl -b" },
        ]
    },
    {
        key: "ssh",
        en: "SSH", fr: "SSH",
        commands: [
            { en: "SSH connection",                 fr: "Connexion SSH",               cmd: "ssh user@host" },
            { en: "SSH with custom port",           fr: "Connexion avec port",         cmd: "ssh -p 2222 user@host" },
            { en: "Copy file to host",              fr: "Copier fichier vers hôte",    cmd: "scp fichier user@host:/chemin/" },
            { en: "Copy file from host",            fr: "Copier depuis hôte",          cmd: "scp user@host:/chemin/fichier ." },
            { en: "Generate SSH key",               fr: "Générer clé SSH",             cmd: "ssh-keygen -t ed25519 -C \"email@example.com\"" },
            { en: "Copy public key to host",        fr: "Copier clé publique",         cmd: "ssh-copy-id user@host" },
            { en: "Restart SSH service",            fr: "Redémarrer SSH",              cmd: "sudo systemctl restart ssh" },
            { en: "SSH service status",             fr: "Statut SSH",                  cmd: "sudo systemctl status ssh" },
        ]
    },
    {
        key: "compression",
        en: "Compression", fr: "Compression",
        commands: [
            { en: "Create tar.gz archive",          fr: "Créer archive tar.gz",        cmd: "tar -czf archive.tar.gz dossier/" },
            { en: "Extract tar.gz",                 fr: "Extraire tar.gz",             cmd: "tar -xzf archive.tar.gz" },
            { en: "Extract to folder",              fr: "Extraire vers dossier",       cmd: "tar -xzf archive.tar.gz -C /destination/" },
            { en: "List tar contents",              fr: "Lister contenu tar",          cmd: "tar -tzf archive.tar.gz" },
            { en: "Zip a folder",                   fr: "Zipper un dossier",           cmd: "zip -r archive.zip dossier/" },
            { en: "Unzip archive",                  fr: "Dézipper",                    cmd: "unzip archive.zip" },
        ]
    },
    {
        key: "users",
        en: "Users", fr: "Utilisateurs",
        commands: [
            { en: "Who am I",                       fr: "Qui suis-je",                 cmd: "whoami" },
            { en: "My UID/GID",                     fr: "Mon UID/GID",                 cmd: "id" },
            { en: "Create a user",                  fr: "Créer un utilisateur",        cmd: "sudo adduser newuser" },
            { en: "Delete a user",                  fr: "Supprimer utilisateur",       cmd: "sudo deluser newuser" },
            { en: "Add to sudo group",              fr: "Ajouter au groupe sudo",      cmd: "sudo usermod -aG sudo newuser" },
            { en: "Change password",                fr: "Changer mot de passe",        cmd: "sudo passwd newuser" },
            { en: "List users",                     fr: "Lister les utilisateurs",     cmd: "cat /etc/passwd | grep /home" },
            { en: "Switch to root",                 fr: "Se connecter en root",        cmd: "sudo -i" },
        ]
    },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function esc(str) {
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// ─── Applet ────────────────────────────────────────────────────────────────────
function LinuxCheatApplet(metadata, orientation, panel_height, instance_id) {
    this._init(metadata, orientation, panel_height, instance_id);
}

LinuxCheatApplet.prototype = {
    __proto__: Applet.IconApplet.prototype,

    _init: function(metadata, orientation, panel_height, instance_id) {
        Applet.IconApplet.prototype._init.call(this, orientation, panel_height, instance_id);

        this.set_applet_icon_symbolic_name("utilities-terminal");
        this.set_applet_tooltip("Linux Cheat Sheet");

        this.settings = new Settings.AppletSettings(this, UUID, instance_id);
        this.settings.bind("language", "language", this._onSettingsChanged.bind(this));

        this.menuManager = new PopupMenu.PopupMenuManager(this);
        this.menu = new Applet.AppletPopupMenu(this, orientation);
        this.menuManager.addMenu(this.menu);

        this._buildMenu();
    },

    _onSettingsChanged: function() {
        this._buildMenu();
    },

    _t: function(item) {
        return (this.language === "fr") ? item.fr : item.en;
    },

    _buildMenu: function() {
        this.menu.removeAll();
        this._subMenus = [];

        this.menu.actor.set_style("min-width: 560px;");

        // Titre
        let titleItem = new PopupMenu.PopupMenuItem("", { reactive: false });
        let titleEn = "Linux Cheat Sheet — click a command to copy";
        let titleFr = "Linux Cheat Sheet — clic sur une commande pour copier";
        titleItem.label.clutter_text.set_markup(
            '<b><span foreground="#5294e2" size="large">Linux Cheat Sheet</span></b>' +
            '<span foreground="#aaaaaa" size="small">   — ' +
            esc(this.language === "fr" ? "clic pour copier" : "click to copy") +
            '</span>'
        );
        this.menu.addMenuItem(titleItem);
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        // Catégories
        for (let cat of COMMANDS) {
            let color = CAT_COLORS[cat.key] || "#aaaaaa";
            let catName = this._t(cat);
            let subMenu = new PopupMenu.PopupSubMenuMenuItem(catName);
            subMenu.label.set_style("color: " + color + "; font-weight: bold;");

            for (let item of cat.commands) {
                let capturedCmd = item.cmd;
                let capturedDesc = this._t(item);

                let entryBox = new St.BoxLayout({
                    vertical: true,
                    reactive: true,
                    track_hover: true,
                    style: "padding: 4px 28px; spacing: 1px;"
                });

                let cmdLabel = new St.Label({ style: "font-size: 11px;" });
                cmdLabel.clutter_text.set_markup(
                    '<tt><b><span foreground="' + color + '">' + esc(item.cmd) + '</span></b></tt>'
                );

                let descLabel = new St.Label({ style: "font-size: 10px;" });
                descLabel.clutter_text.set_markup(
                    '<span foreground="#888888">' + esc(this._t(item)) + '</span>'
                );

                entryBox.add_child(cmdLabel);
                entryBox.add_child(descLabel);

                entryBox.connect('enter-event', function() {
                    entryBox.set_style("padding: 4px 28px; spacing: 1px; background-color: rgba(255,255,255,0.1);");
                });
                entryBox.connect('leave-event', function() {
                    entryBox.set_style("padding: 4px 28px; spacing: 1px;");
                });
                entryBox.connect('button-press-event', () => {
                    this._copyToClipboard(capturedCmd, capturedDesc);
                    this.menu.close();
                    return true;
                });

                subMenu.menu.box.add_child(entryBox);
            }

            // Accordéon
            subMenu.menu.connect("open-state-changed", (menu, isOpen) => {
                if (isOpen) {
                    for (let other of this._subMenus) {
                        if (other !== subMenu && other.menu.isOpen) {
                            other.menu.close(true);
                        }
                    }
                }
            });

            this._subMenus.push(subMenu);
            this.menu.addMenuItem(subMenu);
        }
    },

    _copyToClipboard: function(cmd, desc) {
        let clipboard = St.Clipboard.get_default();
        clipboard.set_text(St.ClipboardType.CLIPBOARD, cmd);
        this.set_applet_tooltip("Copied: " + cmd);
        GLib.spawn_command_line_async(
            'notify-send -i utilities-terminal -t 2000 "Command copied" "' +
            desc.replace(/"/g, "'") + '\n' + cmd.replace(/"/g, "'") + '"'
        );
    },

    on_applet_clicked: function(event) {
        this.menu.toggle();
    }
};

function main(metadata, orientation, panel_height, instance_id) {
    return new LinuxCheatApplet(metadata, orientation, panel_height, instance_id);
}
