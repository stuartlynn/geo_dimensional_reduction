FROM ubuntu:14.04
MAINTAINER Stuart Lynn <stuart@carto.com>


# System packages
RUN apt-get update && apt-get install -y curl git g++

RUN apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:george-edison55/cmake-3.x
RUN apt-get update -y
RUN apt-get install -y cmake


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

RUN pip install cartoframes
RUN pip install -U flask-cors

WORKDIR /app


# RUN cp bhtsne /app ; cp bhtsne.py /app
RUN pip install cmake
WORKDIR /multicoreTSNE
RUN git clone https://github.com/DmitryUlyanov/Multicore-TSNE.git
WORKDIR /multicoreTSNE/Multicore-TSNE/
RUN pip install .

WORKDIR /app

