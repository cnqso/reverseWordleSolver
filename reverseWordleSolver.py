from orderByRarity import orderByRarity
import os
wordlestring = "GBBGBGYBGBGGGGG"
score = 3
solution = "THORN"
wordle = []

#break this terrible recursive function thing into functions,
#one that checks if a letter is valid for the position, one that determines
#if a word is acceptable for a line, one that iterates down a wordlestring


#Check if the program has already organized words by frequency
#Check filesize to ensure it isn't just the result of a botched generation
if os.path.exists("./mostCommonWords.txt") and (os.path.getsize("./mostCommonWords.txt") > 1000):
    print("mostCommonWords.txt is already populated.")
else:
    orderByRarity()
    
#add high bias words to top


wordlestring = "GBBGBGYBGBGGGGG"
score = 3
solution = "THORN"
wordle = []
for x in range(score):
  wordle.append(wordlestring[(5*x):(5*x+5)])


reversesolution = ""

for x in range(score):
    with open("valid-wordle-words.txt", "r") as validwordstext:
        validwords = validwordstext.read().splitlines()
    line = wordle[x]
    print(line)
    wordfound = False
    trueword = ""

    if x == (score-1):
        reversesolution += solution
    else:
        for word in validwords:
            print("word: "+word)
            if wordfound == True:
                break
            for letter in range(5):
                print("letter: "+str(letter) + "")
                if line[letter] == "G" and solution[letter] != word[letter]:
                    break
                if line[letter] == "Y" and (word[letter] not in solution):
                    #Too broad: also needs to check to make sure it isn't a repeat
                    #ie the word "stent" guessing for the word "trump" should only return
                    #one yellow [OR zero yellows dependent on green accurate guesses] 
                    # (check wordle rules for number of yellows on multi-letter guesses
                    # with no greens)
                    break
                if wordlestring[letter] == "B" and word[letter] in solution:
                    break

                #If you made it to the end of this on the 5th letter, you found working answer
                if letter == 4:
                    wordfound = True
                    trueword = word
    print(trueword)
    reversesolution += trueword
    print(reversesolution)
                

                








    #sort valid wordle words in terms of commonality
    #allow for "biased" words to be placed in each spot. As in,
    #different biased words can be applied to different positions

    #Start with biased words: fill in top and second when possible
    #Then do the rest from the top down


    #Go through each word from the top down:
    #The most common word will be accepted
    #Recursively look into the next line. 
    # If there ever is no word that works, go back 1 level and try the next most common word
    # This will in most cases lead to solving very very quickly (backtracking will be rare), 
    # but some words will definitely give you trouble
