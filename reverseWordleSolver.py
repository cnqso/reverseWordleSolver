from orderByRarity import orderByRarity
import os


#break this terrible recursive function thing into functions,
#one that checks if a letter is valid for the position, one that determines
#if a word is acceptable for a line, one that iterates down a wordlestring


#Check if the program has already organized words by frequency
#Check filesize to ensure it isn't just the result of a botched generation


def yellowSquareElligible(gridRow, answer, letter):
    #Weird code for a weird problem
    #Wordle does not give you a yellow letter if you already have that letter highlighted green\
    #The exception is duplicate letters: if you already green-squared all of a letter, new attempts
    #at adding that letter will be blank
    exemptYellows = 0 
    for j in range(5):
        if (letter == answer[j]) and (gridRow[j] == "G"):
            exemptYellows += 1
    if exemptYellows >= answer.count(letter):
    #If all instances of this letter are already green
        return False
    else:
        return True

def checkLine(gridRow, answer, word):
    for i in range(5):
        match gridRow[i]:
            case "G":
                if word[i] != answer[i]:
                    return False

            case "Y":
                if (word[i] not in answer) or (word[i] == answer[i]):
                    return False
                if yellowSquareElligible(gridRow, answer, word[i]) == False:
                    return False

            case "B":
                if word[i] == answer[i]:
                    return False

                if (word[i] in answer) and (yellowSquareElligible(gridRow, answer, word[i]) == True):
                    return False
    else:
        return True

def solveRow(wordleRow, answer, validwords):
    possibleAnswers = []
    if wordleRow == "GGGGG":
        possibleAnswers.append(answer)
        return possibleAnswers
    
    for wordNumber in range(len(validwords)):
        if checkLine(wordleRow, answer, validwords[wordNumber]) == True:
            possibleAnswers.append(validwords[wordNumber])
                
    return possibleAnswers

def reverseSolveWordle (wordlestring, solution):
    reversesolution = ""
    wordlegrid = []
    for x in range(len(wordlestring) // 5):
        wordlegrid.append(wordlestring[(5*x):(5*x+5)])

    with open("mostCommonWords.txt", "r") as validwordstext:
            validwords = validwordstext.read().splitlines()
    with open("biasedWords.txt", "r") as biasedwordstext:
        biasedwords = biasedwordstext.read().splitlines()
        for biasedword in biasedwords:
            validwords.insert(0, biasedword)

    for row in wordlegrid: 
        newAnswers = solveRow(row, solution, validwords)
        reversesolution += newAnswers[0]
        validwords.remove(newAnswers[0])

    return reversesolution



#Start

if os.path.exists("./mostCommonWords.txt") and (os.path.getsize("./mostCommonWords.txt") > 1000):
    print("mostCommonWords.txt is already populated.")
else:
    orderByRarity()

print(reverseSolveWordle("GYBBGGYBBGGGGGG", "SPOKE"))
