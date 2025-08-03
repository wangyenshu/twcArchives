# Dockerfile
# Use a specific version of Ubuntu that matches the desired environment.
# Note: Ubuntu 16.04 is very old and its packages may not be up-to-date or secure.
FROM ubuntu:16.04

# Install necessary dependencies and add the PPA for Ruby 1.8.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        software-properties-common \
        wget \
        git \
        jq \
        ruby1.8 \
        ruby1.8-dev \
        build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# The following lines are an alternative if the PPA is needed for a specific reason,
# but the ruby1.8 package is already available in the standard Ubuntu 16.04 repos.
# If you run into issues with the default package, uncomment and try these:
# RUN apt-add-repository ppa:brightbox/ruby-ng && \
#     apt-get update && \
#     apt-get install -y ruby1.8 ruby1.8-dev

# Set the working directory inside the container
WORKDIR /github/workspace

# Set the default command to run when the container starts
CMD ["bash"]
