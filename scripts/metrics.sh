echo -n "Auth info (user@account:password): "
read -s auth
echo

base_url="https://oa.saas.appdynamics.com/controller/rest/applications/synthetic"

IFS=$'\n'

function traverse() {
    local root="$1"

    # Fetch one level of metric info
    local result="$(curl -s -u "$auth" "$base_url/metrics?output=json&metric-path=${root// /%20}")"

    # Print the "leaves" (AKA metrics)
    for leaf in $(echo "$result" | jq -r '.[] | select(.type=="leaf") | .name'); do
        echo "$root|$leaf"
    done

    # Recur on the folders
    local next_folders="$(echo "$result" | jq -r '.[] | select(.type=="folder") | .name')"
    for folder in $next_folders; do
        if [[ "$folder" == *"By account"* ]]; then
            continue
        fi
        if [[ "$folder" == *"By agent"* ]]; then
            continue
        fi
        if [[ "$folder" == *Disk* ]]; then
            continue
        fi
        if [[ "$folder" == *Network* ]]; then
            continue
        fi
        if [[ "$folder" == *veth* ]]; then
            continue
        fi
        if [[ "$folder" == *beyonce* ]]; then
            continue
        fi

        if [[ -z "$root" ]]; then
            traverse "$folder"
        else
            traverse "$root|$folder"
        fi
    done
}

traverse "Application Infrastructure Performance|shepherd|Custom Metrics|Synthetic|Shepherd"
