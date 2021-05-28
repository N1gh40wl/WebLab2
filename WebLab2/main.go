package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"strconv"
)

type Root struct {
	Text []*Book`json:"Books"`
}
type SimpleRoot struct {
	Books []Book
}

type Book struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	Author *Author `json:"author"`
}

type Author struct {
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
}


var books []Book

type ViewData struct{

	Title string
	Message string
}



func getBooks(w http.ResponseWriter, r *http.Request) {
	file, err := ioutil.ReadFile("base.json")
	var j Root
	err = json.Unmarshal([]byte(file), &j)


	if err != nil {
		log.Fatalf("error parsing JSON: %s\n", err.Error())
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(j)

}


func getBook(w http.ResponseWriter, r *http.Request) {
	file, err := ioutil.ReadFile("base.json")
	var j SimpleRoot
	err = json.Unmarshal([]byte(file), &j)
	if err != nil {
		log.Fatalf("error parsing JSON: %s\n", err.Error())
	}


	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)
	for index, item := range j.Books {
		intVar, _ := strconv.Atoi(params["id"] )
		if index == intVar {
			json.NewEncoder(w).Encode(item)
			return
		}
	}
	json.NewEncoder(w).Encode(j.Books)
}



func createBook(w http.ResponseWriter, r *http.Request) {

	fmt.Println("POST Work!!!")
	w.Header().Set("Content-Type", "application/json")

	file, err := ioutil.ReadFile("base.json")
	var j SimpleRoot
	err = json.Unmarshal([]byte(file), &j)


	if err != nil {
		log.Fatalf("error parsing JSON: %s\n", err.Error())
	}


	var book Book
	_ = json.NewDecoder(r.Body).Decode(&book)
	book.ID = strconv.Itoa(rand.Intn(1000000))
	j.Books = append(j.Books, book)

	rawDataOut, err := json.MarshalIndent(&j, "", "  ")
	if err != nil {
		log.Fatal("JSON marshaling failed:", err)
	}
	err = ioutil.WriteFile("base.json", rawDataOut, 0)
	if err != nil {
		log.Fatal("Cannot write updated settings file:", err)
	}
	json.NewEncoder(w).Encode(j)
}

func updateBook(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Println("PUT Work!!!")

	file, err := ioutil.ReadFile("base.json")
	var j SimpleRoot
	err = json.Unmarshal([]byte(file), &j)
	if err != nil {
		log.Fatalf("error parsing JSON: %s\n", err.Error())
	}

	params := mux.Vars(r)
	for index:= range j.Books {
		intVar, _ := strconv.Atoi(params["id"] )
		if index == intVar {
			j.Books = append(j.Books[:index], j.Books[index+1:]...)
			var book Book

			_ = json.NewDecoder(r.Body).Decode(&book)
			//book.ID = params["id"]
			j.Books = append(j.Books, book)
			rawDataOut, err := json.MarshalIndent(&j, "", "  ")
			if err != nil {
				log.Fatal("JSON marshaling failed:", err)
			}
			err = ioutil.WriteFile("base.json", rawDataOut, 0)
			if err != nil {
				log.Fatal("Cannot write updated settings file:", err)
			}
			json.NewEncoder(w).Encode(book)

			return
		}
	}

}

func deleteBook(w http.ResponseWriter, r *http.Request) {

	fmt.Println("DELETE Work!!!")
	w.Header().Set("Content-Type", "application/json")

	file, err := ioutil.ReadFile("base.json")
	var j SimpleRoot
	err = json.Unmarshal([]byte(file), &j)
	if err != nil {
		log.Fatalf("error parsing JSON: %s\n", err.Error())
	}

	params := mux.Vars(r)
	for index := range j.Books {
		intVar, _ := strconv.Atoi(params["id"] )
		if  index ==  intVar {
			j.Books= append(j.Books[:index], j.Books[index+1:]...)
			break
		}
	}


	rawDataOut, err := json.MarshalIndent(&j, "", "  ")
	if err != nil {
		log.Fatal("JSON marshaling failed:", err)
	}
	err = ioutil.WriteFile("base.json", rawDataOut, 0)
	if err != nil {
		log.Fatal("Cannot write updated settings file:", err)
	}
	json.NewEncoder(w).Encode(j)
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/books", getBooks).Methods("GET")
	r.HandleFunc("/books/{id}", getBook).Methods("GET")
	r.HandleFunc("/books", createBook).Methods("POST")
	r.HandleFunc("/books/{id}", updateBook).Methods("PUT")
	r.HandleFunc("/books/{id}", deleteBook).Methods("DELETE")

	fmt.Println("Server is listening...")
	c := cors.New(cors.Options{
		AllowedMethods: []string{"POST","PUT","DELETE","GET","OPTIONS"},
		AllowedOrigins: []string{"*"},
		OptionsPassthrough: false,

		Debug: false,
	}).Handler(r)
	log.Fatal(http.ListenAndServe(":8000", c))
}


