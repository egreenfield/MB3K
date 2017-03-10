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
        if [[ -z "$root" ]]; then
            traverse "$folder"
        else
            traverse "$root|$folder"
        fi
    done

    # Don't DOS the server for now
    sleep 1
}

traverse ""
