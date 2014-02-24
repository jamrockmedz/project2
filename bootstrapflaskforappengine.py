import os, subprocess, sys
from zipfile import ZipFile

APPDIR="app"
DEFAULT_URL="http://dl.dropbox.com/u/1004432/"
PACKAGE = "virtualenv.py"

def download(
    download_base=DEFAULT_URL, to_dir=os.curdir,
    delay = 15, package = PACKAGE,
    unzip = False,
    unzip_dir = None
):
    """Download setuptools from a specified location and return its filename

    `version` should be a valid setuptools version number that is available
    as an egg for download under the `download_base` URL (which should end
    with a '/'). `to_dir` is the directory where the egg will be downloaded.
    `delay` is the number of seconds to pause before an actual download attempt.
    """
    import urllib2, shutil
    url = download_base + package
    saveto = os.path.join(to_dir, package)
    src = dst = None
    if not os.path.exists(saveto):  # Avoid repeated downloads
        try:
            from distutils import log
            if delay:
                log.warn("""
---------------------------------------------------------------------------
If this script fails
You may need to enable firewall access for this script first.
or define your http_proxy

(Note: if this machine does not have network access, this script will not work )
---------------------------------------------------------------------------"""

                );
            log.warn("Downloading %s", url)
            src = urllib2.urlopen(url)
            # Read/write all in one block, so we don't create a corrupt file
            # if the download is interrupted.
            # data = _validate_md5(egg_name, src.read())
            data = src.read()
            dst = open(saveto,"wb"); dst.write(data)
        finally:
            if src: src.close()
            if dst:
                dst.close()
                if unzip:
                    unzip_package(package,unzip_dir)
    return os.path.realpath(saveto)

def create():
    success = subprocess.call(["python", "virtualenv.py", "--no-site-packages","venv"])
    pipcmd = "venv/bin/pip"
    if sys.platform == 'win32':
        pipcmd = "venv/Scripts/pip"
    success = subprocess.call([
           pipcmd,
           "install",
           "-r",
           "%s/requirements.txt" % APPDIR,
           "-t",
           "%s/lib" %APPDIR,
           "--use-mirrors"
           ])
    success = subprocess.call([
           pipcmd,
           "install",
           "-r",
           "%s/requirements.txt" % APPDIR,
           "--use-mirrors"
           ])


def get_members(zip):
    """function to lose the top level directory
    extract zip file
    borrowed from
    http://stackoverflow.com/questions/8689938/extract-files-from-zip-without-keep-the-top-level-folder-with-python-zipfile
    """
    parts = []
    for name in zip.namelist():
        if not name.endswith('/'):
            parts.append(name.split('/')[:-1])
    prefix = os.path.commonprefix(parts) or ''
    if prefix:
        prefix = '/'.join(prefix) + '/'
    offset = len(prefix)
    for zipinfo in zip.infolist():
        name = zipinfo.filename
        if len(name) > offset:
            zipinfo.filename = name[offset:]
            yield zipinfo


def unzip_package(target,dir=None):
    with ZipFile(target,'r') as myzip:
        if dir:
            myzip.extractall(
                    dir,
                    get_members(myzip)
                   )
        else:
            myzip.extractall()

def get_appengine():
    if sys.platform != 'win32':
        print("grabbing app engine files")
        print("......")
        download(
            download_base="http://googleappengine.googlecode.com/files/",
            package="google_appengine_1.8.9.zip",
            unzip=True,
            unzip_dir='venv/bin',
            )
        files = [
                f for f in os.listdir('venv/bin')
                if f.endswith('.py')
                ]

        for f in files:
            success = subprocess.call(["chmod", "+x", "venv/bin/%s" % f])
    else:
        print("""We've detected Windows. You will need to install AppEngine.
              You can get it at:
              https://developers.google.com/appengine/downloads#Google_App_Engine_SDK_for_Python"""
              )


def install():
    download("https://raw2.github.com/pypa/virtualenv/1.9.X/",
        package="virtualenv.py")
    download(package="helloflask.py")
    download(
     download_base="https://github.com/GoogleCloudPlatform/appengine-python-flask-skeleton/archive/",
     package="master.zip",
     unzip=True,
     unzip_dir=APPDIR
     )
    create()
    get_appengine()

if __name__=='__main__':
    install()
