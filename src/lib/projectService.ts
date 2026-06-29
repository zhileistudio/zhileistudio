import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import { Project } from "../types";
import { defaultProjects } from "../data/defaultProjects";

const COLLECTION_NAME = "projects";

// Ensure the database has default items if empty
export async function initializeProjectsIfEmpty(): Promise<Project[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (querySnapshot.empty) {
      console.log("Firestore projects collection is empty, seeding defaults...");
      // Seed default projects
      for (const proj of defaultProjects) {
        await setDoc(doc(db, COLLECTION_NAME, proj.id), proj);
      }
      return defaultProjects;
    } else {
      const projects: Project[] = [];
      querySnapshot.forEach((docSnap) => {
        projects.push({ ...docSnap.data(), id: docSnap.id } as Project);
      });
      // Sort to match defaultProjects order if possible, or just keep IDs sorted
      return projects.sort((a, b) => a.id.localeCompare(b.id));
    }
  } catch (error) {
    console.error("Error initializing Firebase projects:", error);
    return defaultProjects;
  }
}

// Fetch all projects
export async function getProjects(): Promise<Project[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (querySnapshot.empty) {
      return await initializeProjectsIfEmpty();
    }
    const projects: Project[] = [];
    querySnapshot.forEach((docSnap) => {
      projects.push({ ...docSnap.data(), id: docSnap.id } as Project);
    });
    return projects.sort((a, b) => a.id.localeCompare(b.id));
  } catch (error) {
    console.error("Error fetching projects from Firestore:", error);
    return defaultProjects;
  }
}

// Add or update a project
export async function saveProject(project: Project): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, project.id);
  await setDoc(docRef, project);
}

// Delete a project
export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

// Upload project cover image
export async function uploadProjectImage(id: string, file: File): Promise<string> {
  // Use unique filename under project-covers folder
  const storageRef = ref(storage, `project-covers/${id}-${Date.now()}-${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}
