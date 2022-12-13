import wordfreq
#load text file into a list
def orderByRarity():
    with open("valid-wordle-words.txt", "r") as validwords:
        lines = validwords.readlines()
        print("Found " + str(len(lines))+ " words")
        frequencydict = {}

        #Assign word frequency to each legal wordle word
        for line in lines:
            word = line.strip()
            try:
                frequencydict[word] = wordfreq.word_frequency(word, 'en', wordlist='best',minimum=0.0)
            except:
                print("Error at " + word)
        
        #sort the frequency dictionary into a list of tuples
        frequencydict = sorted(frequencydict.items(), key=lambda x: x[1], reverse=True)
        
        #remove the values from the tuples (surely there is a more efficient way to do this)
        mostCommonWords = []   
        for tuple in frequencydict:
            mostCommonWords.append(tuple[0])
        print(mostCommonWords)

    #dump these into a text file to reduce repeat computation
    with open('mostCommonWords.txt', 'w') as f:
        for word in mostCommonWords:
            f.write(f"{word.upper()}\n")