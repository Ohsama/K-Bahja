import csv
import sys
import os

def parse_cities_to_sql(csv_filename, output_sql_filename):
    """
    Parses exactly the format of 'algeria_cities (1).csv' and outputs SQL 
    for Supabase to seed the 'locations' table with unique wilaya/daira pairs.
    """
    
    # We use a set to ensure unique pairs as multiple communes can form a single daira.
    unique_locations = set()
    
    print(f"Reading from {csv_filename}...")
    
    if not os.path.exists(csv_filename):
        print(f"Error: Could not find {csv_filename}")
        sys.exit(1)

    with open(csv_filename, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            wilaya_name = row['wilaya_name'].strip()
            # Clean up potential leading/trailing quotes or spaces in the CSV
            wilaya_name = wilaya_name.replace('"', '').strip()
            
            daira_name = row['daira_name'].strip()
            daira_name = daira_name.replace('"', '').strip()
            
            if wilaya_name and daira_name:
                unique_locations.add((wilaya_name, daira_name))
                
    print(f"Found {len(unique_locations)} unique Dairas across Wilayas. Writing to SQL...")

    with open(output_sql_filename, 'w', encoding='utf-8') as out_f:
        out_f.write("-- Supabase Migration File for inserting Dairas/Wilayas\n")
        out_f.write("CREATE TABLE IF NOT EXISTS locations (\n")
        out_f.write("  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n")
        out_f.write("  wilaya_name TEXT NOT NULL,\n")
        out_f.write("  daira_name TEXT NOT NULL,\n")
        out_f.write("  UNIQUE(wilaya_name, daira_name)\n")
        out_f.write(");\n\n")
        
        # Batch inserting for cleaner SQL Output
        # Sort so the SQL file is nicely ordered by Wilaya then Daira
        sorted_locations = sorted(list(unique_locations), key=lambda x: (x[0], x[1]))
        
        out_f.write("INSERT INTO locations (wilaya_name, daira_name) VALUES\n")
        
        for idx, (wilaya, daira) in enumerate(sorted_locations):
            # Escape single quotes in Arabic strings (e.g. M'sila)
            safe_wilaya = wilaya.replace("'", "''")
            safe_daira = daira.replace("'", "''")
            
            line = f"  ('{safe_wilaya}', '{safe_daira}')"
            if idx == len(sorted_locations) - 1:
                line += ";"
            else:
                line += ","
            out_f.write(line + "\n")
            
    print(f"SQL migration successfully generated at: {output_sql_filename}")
    print("Run this SQL directly in your Supabase Dashboard SQL Editor.")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    default_csv = os.path.join(project_root, "algeria_cities (1).csv")
    output_sql = os.path.join(current_dir, "01_seed_locations.sql")
    
    parse_cities_to_sql(default_csv, output_sql)
