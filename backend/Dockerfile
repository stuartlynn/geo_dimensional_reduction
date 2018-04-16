FROM ubuntu:14.04
MAINTAINER Stuart Lynn <stuart@carto.com>

# System packages
RUN apt-get update && apt-get install -y curl git g++

# Install miniconda to /miniconda
RUN curl -LO https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
RUN bash Miniconda3-latest-Linux-x86_64.sh -p /miniconda -b
RUN rm Miniconda3-latest-Linux-x86_64.sh
ENV PATH=/miniconda/bin:${PATH}
RUN conda update -y conda

# Python packages from conda
RUN conda install -y \
    scikit-learn \
    pandas \
    flask \
    ipython \
    pillow

RUN pip install -U flask-cors

WORKDIR /app

RUN mkdir /bhtsne
WORKDIR /bhtsne

RUN git clone https://github.com/lvdmaaten/bhtsne.git
WORKDIR /bhtsne/bhtsne/
RUN g++ sptree.cpp tsne.cpp tsne_main.cpp -o bh_tsne -O2


# RUN cp bhtsne /app ; cp bhtsne.py /app

WORKDIR /app

