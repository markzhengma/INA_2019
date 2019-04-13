# plumber.R
library(plyr)
library(tm)
library(wordcloud)
library(pdftools)
library(tidyverse)
library(plumber)

#' Echo the parameter that was sent in
#' @param msg The message to echo back.
#' @get /echo
function(){
  msg = "hello world"
}

#' Converting PDF to Text from URL Test
#' @param pdfUrl The pdf url.
#' @get /text
function(pdfUrl){
  text = pdf_text(pdfUrl)
}

#Function to Tokenize a Paper and Return the Data Frame of Keywords in a Paper in Order of Decreasing Occurence
tokenDataFrame <- function(abstract){
  abstract_source <- VectorSource(abstract)
  corpus <- Corpus(abstract_source)
  corpus <- tm_map(corpus, content_transformer(tolower))
  corpus <- tm_map(corpus, removePunctuation)
  corpus <- tm_map(corpus, stripWhitespace)
  corpus <- tm_map(corpus, removeWords, stopwords("english"))
  dtm <- DocumentTermMatrix(corpus)
  dtm2 <- as.matrix(dtm)
  
  #Creating Frequency Tables
  frequency <- colSums(dtm2)
  frequency <- sort(frequency, decreasing = TRUE)
  frequency <- as.data.frame(frequency)
  rowNames <- row.names(frequency)
  frequencyWords <- frequency$frequency
  frequencyTable <- cbind.data.frame(rowNames, frequencyWords)
  names(frequencyTable) <- c("keywords", "frequency")
  
  return(frequencyTable)
}

#' Converting PDF to Text from URL Test
#' @param abstract The pdf url.
#' @get /topic
function(abstract){
  tokens <- tokenDataFrame(abstract)
  CS = 0
  CH = 0
  PH = 0
  topic = ""
  for (n in tokens$keywords){
    if (is.element(tolower(n), uniqueCSKeywords)){
      index = which(tokens$keywords == n)
      weighting = tokens$frequency[index]
      CS = CS + weighting
    }
    if (is.element(tolower(n), uniqueCHEMKeywords)){
      index = which(tokens$keywords == n)
      weighting = tokens$frequency[index]
      CH = CH + weighting
    }
    if(is.element(tolower(n), uniquePHYSKeywords)){
      index = which(tokens$keywords == n)
      weighting = tokens$frequency[index]
      PH = PH + weighting
    }
  }
  if (CS > CH & CS > PH){
    topic = "Computer Science"
  }
  else if (CH > CS & CH > PH){
    topic = "Chemistry"
  }
  else {
    topic = "Physics"
  }
  probabilityCS = (CS / (CS + CH + PH)) * 100
  probabilityCS = round(probabilityCS, digits = 2)
  probabilityCHEM = (CH/ (CS + CH + PH)) * 100
  probabilityCHEM = round(probabilityCHEM, digits = 2)
  probabilityPHYS = (PH / (CS + CH + PH)) * 100
  probabilityPHYS = round(probabilityPHYS, digits = 2)
  probability <- c(probabilityCS, probabilityCHEM, probabilityPHYS)
  labls <- c(paste("Computer Science ", probabilityCS,"%"), paste("Chemistry ", probabilityCHEM, "%"), paste("Physics", probabilityPHYS, "%"))
  par(mar=c(1,1,1,1))
  pie(probability, labels = labls, main="Topic Probability Distribution Likelihood")
  return(paste(CS, probabilityCS, CH, probabilityCHEM, PH, probabilityPHYS, topic))
}