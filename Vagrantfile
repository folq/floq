Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "public_network"
  config.vm.synced_folder "./", "/floq/"

  config.vm.provider "virtualbox" do |vb|
    vb.gui = false
    vb.memory = "4096"
  end

  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
    echo 'deb https://apt.dockerproject.org/repo ubuntu-trusty main'|sudo tee /etc/apt/sources.list.d/fpco.list
    sudo apt-get update && sudo apt-get upgrade -y
    sudo apt-get install linux-image-extra-`uname -r` docker-engine -y
    sudo service docker start
    sudo usermod -aG docker vagrant
    sudo service docker restart
  SHELL
end
